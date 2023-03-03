const { Client } = require('pg');
const fs = require('fs');

// create a new PostgreSQL client
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'index',
    password: 'postgres',
    port: 5433,
});

// connect to the database
client.connect();

// query the trust network data from the database
const query = `
    SELECT "user", "can_send_to", "limit"
    FROM crc_current_trust_2
    WHERE "user" != "can_send_to"
`;

client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        client.end();
        return;
    }

    // create a new DOT string
    let dot = 'digraph TrustNetwork {\n';

    // iterate through the rows and add nodes and edges to the DOT string
    res.rows.forEach(row => {
        // add a new node for each user in the trust network
        const user = row.user;
        dot += `  "${user}";\n`;

        // add a new node for each user that the current user can send to
        const canSendTo = row.can_send_to;
        dot += `  "${canSendTo}";\n`;

        // add an edge between the user and canSendTo nodes
        const trustLimit = row.limit;
        const trustLimitStr = trustLimit === 100 ? '' : ` [label="${trustLimit}%"]`;
        dot += `  "${user}" -> "${canSendTo}"${trustLimitStr};\n`;
    });

    // close the DOT string
    dot += '}\n';

    // save the DOT string to a file
    fs.writeFile('trust-network.dot', dot, err => {
        if (err) {
            console.error(err);
        } else {
            console.log('DOT file saved successfully!');
        }

        // disconnect from the database
        client.end();
    });
});
