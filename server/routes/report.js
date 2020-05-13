const express = require('express');
const axios = require('axios');
const router = express.Router();
const ObjectsToCsv = require('objects-to-csv');
const { generateToken } = require('opentok-jwt');

const processData = async (json) => { 
	const resources = json.data.data.project.projectData.resources;
 
	filePath = __dirname + '/report.csv'; 

	await new ObjectsToCsv(resources).toDisk(filePath, { allColumns: true });

	return filePath; 
};

function Router() {

	router.post('/', async function (req, res, next) {
		console.log(`[POST /report] - key:${req.body.api_key}, start_date:${req.body.date_start}, end:${req.body.date_end}`); 

		const { api_key, api_secret, date_start, date_end } = req.body;
		
		const jwt = generateToken(api_key, api_secret, 'project'); 
		
		try { 
			
			const headers = {
				'X-OPENTOK-AUTH': jwt
			}; 

			query  = `{
				project(projectId: ${api_key}) {
				  projectData(start: ${date_start}, end: ${date_end}, interval: AUTO) {
					interval, 
					resources {
					  intervalStart, 
					  intervalEnd, 
					  usage {
						hdArchiveComposedMinutes,
						hdBroadcastComposedMinutes,
						hlsMinutes,
						individualArchiveMinutes,
						sdArchiveComposedMinutes,
						sdBroadcastComposedMinutes,
						sipUserMinutes,
						streamedPublishedMinutes,
						streamedSubscribedMinutes
					  }
					}
				  }
				}
			}
			  `;

			const data = await axios.post('https://insights.opentok.com/graphql', { query }, { headers }); 

			const path = await processData(data); 

			res.status(200).sendFile(path);

		} catch (err) {  
			res.status(404).json(err); 
		}
	});

	router.get('/list', async function (req, res, next) {
		const resBody = appointments.getAppointments(); 
		
		res.status(200).json(resBody);
	});
	return router;
}

module.exports = Router;
