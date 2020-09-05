import express from 'express';
import db from './database/connection';
import ConvertHoursToMinutes from './utils/ConvertHoursToMinutes';

const routes = express.Router();

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

routes.post('/classes', async (request, response) => {

    const {name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;

    const trx = await db.transaction();  

    try {

        console.log(request.body);

        const insertedUsersId = await trx('users').insert({
            name, 
            avatar, 
            whatsapp, 
            bio,
        });
    
        const user_id = insertedUsersId[0];
    
        const insertedClassesId = await trx('classes').insert({
            subject, 
            cost,
            user_id,
        })
    
        const class_id = insertedClassesId[0];
    
        const classSchedule = schedule.map((scheduleItem: ScheduleItem)=> {
            return {
                class_id,
                week_day: scheduleItem.week_day,
                from: ConvertHoursToMinutes(scheduleItem.from),
                to: ConvertHoursToMinutes(scheduleItem.to),
            };
        });
    
        await trx('schedule').insert(classSchedule);
    
        await trx.commit();

        return response.status(201).send();

    }catch (err) {

        await trx.rollback();

        console.log("error");

        return response.status(400).json({
            error: "Unexpected error"
        });
    }
});


routes.post('/classes', async (request, response) => {

    const {name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;

    const trx = await db.transaction();  

    try {

        console.log(request.body);

        const insertedUsersId = await trx('users').insert({
            name, 
            avatar, 
            whatsapp, 
            bio,
        });
    
        const user_id = insertedUsersId[0];
    
        const insertedClassesId = await trx('classes').insert({
            subject, 
            cost,
            user_id,
        })
    
        const class_id = insertedClassesId[0];
    
        const classSchedule = schedule.map((scheduleItem: ScheduleItem)=> {
            return {
                class_id,
                week_day: scheduleItem.week_day,
                from: ConvertHoursToMinutes(scheduleItem.from),
                to: ConvertHoursToMinutes(scheduleItem.to),
            };
        });
    
        await trx('schedule').insert(classSchedule);
    
        await trx.commit();

        return response.status(201).send();

    }catch (err) {

        await trx.rollback();

        console.log("error");

        return response.status(400).json({
            error: "Unexpected error"
        });
    }
});

export default routes;