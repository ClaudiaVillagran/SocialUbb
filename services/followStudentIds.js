const Follow = require('../models/follow');

const followStudentIds = async (identityStudentId) => {
    try {
        //sacar info de seguimiento
        let following = await Follow.find({'student': identityStudentId })
                                    .select({'_id': 0, '__v': 0, 'student': 0, 'created_at': 0})
                                    .exec();

        let followers = await Follow.find({'followed': identityStudentId })
                                    .select({'_id': 0, '__v': 0, 'followed': 0, 'created_at': 0})
                                    .exec();

        //ANTES DE PROCESAR EÑ ARRAY
                            // "student_following": [
                            //     {
                            //         "followed": "647a47d72d0f479a9ece06b6"
                            //     },
                            //     {
                            //         "followed": "64890cb11c388f93453d7932"
                            //     }
                            // ],
                            // "student_follow_me": [
                            //     {
                            //         "student": "64890cb11c388f93453d7932"
                            //     }

        //DESPUES DE PROCESAR EL ARRAY
                            // "student_following": [
                            //     "647a47d72d0f479a9ece06b6",
                            //     "64890cb11c388f93453d7932"
                            // ],
                            // "student_follow_me": [
                            //     "64890cb11c388f93453d7932"
                            // ]
        //procesar array de id
        let followingClean = [];

        following.forEach(follow => {
            followingClean.push(follow.followed);
        });

        let followersClean = [];

        followers.forEach(follow => {
            followersClean.push(follow.student);
        });

        return {
            following: followingClean,
            followers: followersClean
        }
    }catch (error) {
        return {};
    }
};

const followThisStudent = async (identityStudentId, profileStudentId) => {
    //sacar info de seguimiento
    let following = await Follow.findOne({'student': identityStudentId, 'followed': profileStudentId });

    let follower = await Follow.findOne({'followed': identityStudentId , 'student': profileStudentId });

    return{
        following,
        follower
    }
};

module.exports = {
    followStudentIds,
    followThisStudent
};