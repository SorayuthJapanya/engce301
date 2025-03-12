const sql = require('mssql');
const sqlConfig = require('../sqlConfig')['development'];

const { v4: uuid } = require('uuid');

console.log("sqlConfig: ", sqlConfig);


// POST Login

async function postLoginAgentByAgentCode(agentcode, agentpass) {

    try {
        console.log("Auth Agent Data: ", { agentcode, agentpass });

        let pool = await sql.connect(sqlConfig);

        let result = await pool.request()
            .input('agentcode', agentcode)
            .input('agentpass', agentpass)
            .query(`
            SELECT * FROM [OnlineAgents] 
            WHERE agent_code = @agentcode AND agent_pass = @agentpass
        `); //@agentcode, @agent_pass

        console.log("result: ", result);

        if (!result || result.recordsets[0].length === 0) {
            console.log("result: ERROR");
            return ({
                error: true,
                statusCode: 404,
                errMessage: 'Agent not found',
            });

        } else {

            return ({
                error: false,
                statusCode: 200,
                data: result.recordset[0]
            });

        }

    }
    catch (error) {
        console.log(error);
        return ({
            error: true,
            statusCode: 500,
            errMessage: 'An internal server error occurred',
        });
    }
}

// GET 
async function getOnlineAgentByAgentCode(agentcode) {

    try {
        console.log("agentcode: ", agentcode);

        let pool = await sql.connect(sqlConfig);

        let result = await pool.request().query(`SELECT * FROM [OnlineAgents] WHERE [agent_code] = '${agentcode}'`); //@agentcode

        console.log("result: ", result);

        if (!result || result.recordsets[0].length === 0) {
            console.log("result: ERROR");
            return ({
                error: true,
                statusCode: 404,
                errMessage: 'Agent not found',
            });

        } else {

            return ({
                error: false,
                statusCode: 200,
                data: result.recordset[0]
            });

        }

    }
    catch (error) {
        console.log(error);
        return ({
            error: true,
            statusCode: 500,
            errMessage: 'An internal server error occurred',
        });
    }
}

// POST
async function postOnlineAgentStatus(AgentCode, AgentName, IsLogin, AgentStatus) {
    try {
        console.log("Posting agent data: ", { AgentCode, AgentName, IsLogin, AgentStatus });

        if (!AgentCode) {
            return {
                error: true,
                statusCode: 400,
                errMessage: 'Please provide agentcode.',
            };
        }

        let pool = await sql.connect(sqlConfig);

        let result = await pool.request()
            .input('agent_code', sql.VarChar(20), AgentCode)
            .input('AgentName', sql.NVarChar(20), AgentName)
            .input('IsLogin', sql.Char(1), IsLogin)
            .input('AgentStatus', sql.Char(1), AgentStatus)
            .query(`SELECT * FROM [OnlineAgents] WHERE [agent_code] = @agent_code`);


        console.log("Query result: ", result);

        if (!result || result.recordset.length === 0) {
            // Insert
            await pool.request()
                .input('agent_code', sql.VarChar(20), AgentCode)
                .input('AgentName', sql.NVarChar, AgentName)
                .input('IsLogin', sql.Char(1), IsLogin)
                .input('AgentStatus', sql.Char(1), AgentStatus)
                .query(`INSERT INTO [OnlineAgents] (agent_code, AgentName, IsLogin, AgentStatus) 
                VALUES (@agent_code, @AgentName, @IsLogin, @AgentStatus)`);
            console.log("Inserted new agent");

            return {
                error: false,
                statusCode: 200,
                message: 'Agent inserted successfully'
            };
        } else {
            // Update
            await pool.request()
                .input('agent_code', sql.VarChar(20), AgentCode)
                .input('AgentName', sql.NVarChar, AgentName)
                .input('IsLogin', sql.Char(1), IsLogin)
                .input('AgentStatus', sql.Char(1), AgentStatus)
                .query(`UPDATE [OnlineAgents] 
                SET AgentName = @AgentName, IsLogin = @IsLogin, AgentStatus = @AgentStatus 
                WHERE agent_code = @agent_code`);
            console.log("Updated existing agent");

            return {
                error: false,
                statusCode: 200,
                message: 'Agent updated successfully'
            };
        }
    } catch (error) {
        console.log(error);
        return {
            error: true,
            statusCode: 500,
            errMessage: 'An internal server error occurred',
        };
    }
}


module.exports.OnlineAgentRepo = {

    getOnlineAgentByAgentCode: getOnlineAgentByAgentCode, postOnlineAgentStatus, postLoginAgentByAgentCode

}
