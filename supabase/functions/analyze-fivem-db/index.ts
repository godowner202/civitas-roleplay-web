import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TableInfo {
  table_name: string;
  table_schema: string;
  table_type: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string;
  character_maximum_length: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting FiveM database analysis...');

    // Get database credentials from environment
    const DB_HOST = Deno.env.get('FIVEM_DB_HOST');
    const DB_USER = Deno.env.get('FIVEM_DB_USER'); 
    const DB_PASSWORD = Deno.env.get('FIVEM_DB_PASSWORD');
    const DB_NAME = Deno.env.get('FIVEM_DB_NAME');

    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      console.error('Missing database credentials');
      return new Response(
        JSON.stringify({ error: 'Database credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Connecting to MySQL database: ${DB_HOST}:3306/${DB_NAME}`);

    // Import MySQL driver
    const { Client } = await import("https://deno.land/x/mysql@v2.12.1/mod.ts");

    // Create MySQL connection
    const client = await new Client().connect({
      hostname: DB_HOST,
      port: 3306,
      username: DB_USER,
      password: DB_PASSWORD,
      db: DB_NAME,
    });

    console.log('Successfully connected to FiveM database');

    // Get all tables in the database
    const tablesResult = await client.execute(`
      SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_TYPE 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [DB_NAME]);

    console.log(`Found ${tablesResult.rows?.length || 0} tables`);

    const tables: TableInfo[] = (tablesResult.rows || []).map((row: any) => ({
      table_name: row[0],
      table_schema: row[1], 
      table_type: row[2]
    }));

    // Analyze table structures and identify key tables
    const tableAnalysis: Record<string, any> = {};
    const playerRelatedTables: string[] = [];
    
    for (const table of tables) {
      try {
        console.log(`Analyzing table: ${table.table_name}`);
        
        // Get column information
        const columnsResult = await client.execute(`
          SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, CHARACTER_MAXIMUM_LENGTH
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [DB_NAME, table.table_name]);

        const columns: ColumnInfo[] = (columnsResult.rows || []).map((row: any) => ({
          column_name: row[0],
          data_type: row[1],
          is_nullable: row[2],
          column_default: row[3],
          character_maximum_length: row[4]
        }));

        // Get row count
        const countResult = await client.execute(`SELECT COUNT(*) as count FROM \`${table.table_name}\``);
        const rowCount = countResult.rows?.[0]?.[0] || 0;

        // Identify player-related tables
        const tableName = table.table_name.toLowerCase();
        const hasPlayerColumns = columns.some(col => {
          const colName = col.column_name.toLowerCase();
          return colName.includes('identifier') || 
                 colName.includes('steam') || 
                 colName.includes('license') ||
                 colName.includes('discord') ||
                 colName.includes('player') ||
                 colName.includes('user') ||
                 colName.includes('character');
        });

        if (hasPlayerColumns || 
            tableName.includes('user') || 
            tableName.includes('player') || 
            tableName.includes('character') ||
            tableName.includes('job') ||
            tableName.includes('money') ||
            tableName.includes('vehicle') ||
            tableName.includes('property') ||
            tableName.includes('inventory')) {
          playerRelatedTables.push(table.table_name);
        }

        tableAnalysis[table.table_name] = {
          columns,
          rowCount,
          isPlayerRelated: hasPlayerColumns || playerRelatedTables.includes(table.table_name)
        };

        // Sample a few rows for structure analysis (only for small tables)
        if (rowCount > 0 && rowCount < 1000) {
          try {
            const sampleResult = await client.execute(`SELECT * FROM \`${table.table_name}\` LIMIT 3`);
            tableAnalysis[table.table_name].sampleData = sampleResult.rows;
          } catch (sampleError) {
            console.log(`Could not sample data from ${table.table_name}:`, sampleError);
          }
        }

      } catch (tableError) {
        console.log(`Error analyzing table ${table.table_name}:`, tableError);
        tableAnalysis[table.table_name] = {
          error: tableError.message,
          columns: [],
          rowCount: 0,
          isPlayerRelated: false
        };
      }
    }

    // Identify framework type based on table names
    let frameworkType = 'unknown';
    const tableNames = tables.map(t => t.table_name.toLowerCase());
    
    if (tableNames.includes('users') && tableNames.includes('jobs')) {
      if (tableNames.some(name => name.includes('esx'))) {
        frameworkType = 'ESX';
      } else if (tableNames.some(name => name.includes('qb') || name.includes('qbus'))) {
        frameworkType = 'QBCore';
      } else {
        frameworkType = 'ESX-like';
      }
    } else if (tableNames.some(name => name.includes('qb') || name.includes('qbus'))) {
      frameworkType = 'QBCore';
    }

    await client.close();
    console.log('Database analysis complete');

    const analysis = {
      framework: frameworkType,
      totalTables: tables.length,
      playerRelatedTables,
      tables: tableAnalysis,
      summary: {
        hasUsers: tableNames.includes('users'),
        hasJobs: tableNames.includes('jobs'), 
        hasVehicles: tableNames.some(name => name.includes('vehicle')),
        hasProperties: tableNames.some(name => name.includes('property') || name.includes('house')),
        hasInventory: tableNames.some(name => name.includes('inventory') || name.includes('items')),
        hasMoney: tableNames.some(name => name.includes('money') || name.includes('bank')),
        identifierColumns: []
      }
    };

    // Find identifier patterns
    for (const [tableName, tableData] of Object.entries(tableAnalysis)) {
      if (typeof tableData === 'object' && tableData.columns) {
        for (const column of tableData.columns) {
          const colName = column.column_name.toLowerCase();
          if (colName.includes('identifier') || colName.includes('steam') || 
              colName.includes('license') || colName.includes('discord')) {
            analysis.summary.identifierColumns.push({
              table: tableName,
              column: column.column_name,
              type: column.data_type
            });
          }
        }
      }
    }

    return new Response(JSON.stringify(analysis, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in FiveM database analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Database analysis failed', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});