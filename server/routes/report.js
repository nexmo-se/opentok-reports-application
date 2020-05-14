const express = require('express');
const axios = require('axios');
const fs = require('fs')
const router = express.Router();
const ObjectsToCsv = require('objects-to-csv');
const { generateToken } = require('opentok-jwt');

const processData = async (sessions, reportName) => { 

	const result = [];

	//Scheme 
	var sessionId, subMinutes, createdAt; 

	sessions.forEach(session => {
		sessionId = session.sessionId; 
		subMinutes = session.subscriberMinutes; 
		createdAt = session.meetings.resources[0].createdAt; 
		
		result.push({ 
			sessionId, SubscriberMinutes: subMinutes, CreatedAt: createdAt
		}); 
	});

	filePath = __dirname + "/" + reportName + ".csv"; 

	await new ObjectsToCsv(result).toDisk(filePath);

	return filePath; 
};

function Router() {

	router.post('/', async function (req, res, next) {
		console.log(`[POST /report] - key:${req.body.api_key}, start_date:${req.body.date_start}, end:${req.body.date_end}`); 

		const { api_key, api_secret, date_start, date_end } = req.body;

		const reportName = `${api_key}`; 

		res.status(200).json({report_name: reportName});
		
		const jwt = generateToken(api_key, api_secret, 'project'); 
		
		try { 
			
			const headers = {
				'X-OPENTOK-AUTH': jwt
			}; 

			sessionsListQuery  = 
			`{
				project(projectId: ${api_key}) {
					sessionData { 
						sessionSummaries(start: ${date_start}, end: ${date_end}, endCursor:) { 
							pageInfo {
								endCursor,
								hasNextPage
							}
							resources {
								sessionId,
								subscriberMinutes, 
								meetings(first: 1) {
									resources{
									  createdAt
									}
								}
							}
						}
					}
				}
			}`;

			var endCursor; 
			var hasNextPage = false; 
			var sessionsList = []; 
			var rawSessionsList; 

			do {
				console.log(`[POST /report] - querying sessions list, sessionsList.size():${sessionsList.length}, hasNextPage:${hasNextPage}, endCursor:${endCursor}`); 
				const listQuery = endCursor ? sessionsListQuery.replace(`, endCursor:`, `, endCursor: "${endCursor}"`) : sessionsListQuery.replace(`, endCursor:`, ``);
				rawSessionsList = await axios.post('https://insights.opentok.com/graphql', { query: listQuery }, { headers }); 
				sessionsList = sessionsList.concat(rawSessionsList.data.data.project.sessionData.sessionSummaries.resources); 
				hasNextPage = rawSessionsList.data.data.project.sessionData.sessionSummaries.pageInfo.hasNextPage; 
				endCursor = rawSessionsList.data.data.project.sessionData.sessionSummaries.pageInfo.endCursor; 
			} while (hasNextPage); 

			await processData(sessionsList, reportName); 
			
			//Notify done 
			console.log(`[POST /report] - report done: ${reportName}`); 
		} catch (err) {  
			//Send error
			console.log(`[POST /report] - error: ${JSON.stringify}`); 
			res.status(404).json(err); 
		}
	});

	router.post('/get', async function (req, res, next) {
		console.log(`[POST /report/get] report_name: ${req.body.report_name}`); 
		
		const name = req.body.report_name; 
		const filePath = __dirname + "/" + name + ".csv"; 
		
		if (fs.existsSync(filePath)) {
			res.status(200).sendFile(filePath); 
		  } else  {  
			res.status(404).json({err: 'File not ready'});
		  }
	});

	return router;
}

module.exports = Router;
