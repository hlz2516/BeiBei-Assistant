const { recordRemembered } = require('../common/dbContext')
const schedule = require('node-schedule');

process.on('SIGINT', function () { 
    schedule.gracefulShutdown()
    .then(() => process.exit(0))
  });


const recordJob = {
    name:'recordRemembered',
    rule:'0 1 0 * * *',
    job:async ()=> {  
        try {
            await recordRemembered();
        } catch (error) {
            console.error(error);
        }
    }
}
 

const mySchedule = {
    start(job){
        return schedule.scheduleJob(job.name,job.rule,job.job);
    },
    stop(job){
        schedule.cancelJob(job);
    }
}



module.exports = {
    mySchedule,
    recordJob
}