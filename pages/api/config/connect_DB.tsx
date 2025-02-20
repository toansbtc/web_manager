import oracledb from 'oracledb';
import mysql from 'mysql2'


export async function executeData(sql: String) {
    const connection = await oracledb.getConnection({
        user: 'fvgit',
        password: 'fvgit',
        connectionString: '5.1.182.199:1521/fvgitdb'
    });
    const result = await connection.execute(sql);
    connection.close();
    return result.rows
}

export async function excute_mySQL(sql: string) {
    const config = {
        host: 'localhost',
        user: 'root',
        password: 'Binh@1997',
        database: 'my_sql',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }

    const pool = await mysql.createPool(config);
    const resuilt = pool.query(sql, (error, resuilt, []) => {
        if (error)
            console.log(error)
        else
            console.log(resuilt)
    })
}