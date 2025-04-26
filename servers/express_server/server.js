const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('/workspaces/skills_swap/servers/express_server/skillsswap-df801-firebase-adminsdk-fbsvc-92116e16aa.json'); // Replace with your Firebase service account file
const  cos=require('cors');
const e = require('express');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const app = express();
app.use(cos());
app.use(express.json());

app.get('/',(req,res)=>{
    console.log("root")
    res.json({"msg":"helloworld"});
    }
);


app.get('/api/getUserInfo/:uid', async (req, res) => {
    const { uid } = req.params;
    console.log("userinfo",uid);
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        const userData = userDoc.data();
        res.json({
            uid: uid,
            email: userData.email,
            username: userData.username,
            firstName: userData.first_name,
            lastName: userData.last_name,
            bio:userData.bio,
            profilePicture: userData.profile_picture || null,
            skills: userData.skills,
            goals: userData.goals,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create connection request
app.post('/api/createConnectionRequest', async (req, res) => {
    console.log(req.body);
    const { fromUid, toUid } = req.body;
    try {
        const userDoc = await db.collection('users').doc(toUid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        await db.collection('users').doc(toUid).update({
            connection_requests: admin.firestore.FieldValue.arrayUnion(fromUid)
        });
        res.send('Connection request sent');
    } catch (error) {
        console.error('Error creating connection request:', error);
        res.status(500).send(error.message);
    }
});

// Accept connection request
app.post('/api/acceptConnectionRequest', async (req, res) => {
    const { fromUid, toUid } = req.body;
    try {
        const userDoc = await db.collection('users').doc(toUid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        await db.collection('users').doc(toUid).update({
            connection_requests: admin.firestore.FieldValue.arrayRemove(fromUid),
            connections: admin.firestore.FieldValue.arrayUnion(fromUid)
        });
        await db.collection('users').doc(fromUid).update({
            connections: admin.firestore.FieldValue.arrayUnion(toUid)
        });
        res.json(true);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.post('/api/rejectConnectionRequest', async (req, res) => {
    const { fromUid, toUid } = req.body;
    try {
        const userDoc = await db.collection('users').doc(toUid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        await db.collection('users').doc(toUid).update({
            connection_requests: admin.firestore.FieldValue.arrayRemove(fromUid)
        });
        res.json(true);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/removeConnection', async (req, res) => {
    const { fromUid, toUid } = req.body;
    try {
        const fromUserDoc = await db.collection('users').doc(fromUid).get();
        const toUserDoc = await db.collection('users').doc(toUid).get();

        if (!fromUserDoc.exists || !toUserDoc.exists) {
            return res.status(404).send('One or both users not found');
        }

        await db.collection('users').doc(fromUid).update({
            connections: admin.firestore.FieldValue.arrayRemove(toUid)
        });

        await db.collection('users').doc(toUid).update({
            connections: admin.firestore.FieldValue.arrayRemove(fromUid)
        });

        res.send('Connection removed');
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Follow user
app.post('/api/followUser', async (req, res) => {
    const { fromUid, toUid } = req.body;
    console.log("follow",fromUid, toUid)    
    try {
        await db.collection('users').doc(toUid).update({
            followers: admin.firestore.FieldValue.arrayUnion(fromUid)
        });
        await db.collection('users').doc(fromUid).update({
            following: admin.firestore.FieldValue.arrayUnion(toUid)
        });
        res.send('User followed');
    } catch (error) {
        console.log(error)

        res.status(500).send(error.message);
    }
});

// Unfollow user
app.post('/api/unfollowUser', async (req, res) => {
    const fromUid = req.body.fromUid;
    const toUid = req.body.toUid;
    try {
        await db.collection('users').doc(toUid).update({
            followers: admin.firestore.FieldValue.arrayRemove(fromUid)
        });
        await db.collection('users').doc(fromUid).update({
            following: admin.firestore.FieldValue.arrayRemove(toUid)
        });
        res.send('User unfollowed');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get connections
app.get('/api/getConnections/:uid', async (req, res) => {
    const { uid } = req.params;
    console.log("getConnections",uid);
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        console.log(userDoc.data());
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        const connections = userDoc.data().connections || [];
        const connectionDetails = await Promise.all(
            connections.map(async (connectionUid) => {
                const connectionDoc = await db.collection('users').doc(connectionUid).get();
                const connectionData = connectionDoc.data();
                return {
                    uid: connectionUid,
                    firstName: connectionData.first_name,
                    lastName: connectionData.last_name
                };
            })
        );
        res.json(connectionDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get followers
app.get('/api/getFollowers/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        const followers = userDoc.data().followers || [];
        const followerDetails = await Promise.all(
            followers.map(async (followerUid) => {
                const followerDoc = await db.collection('users').doc(followerUid).get();
                const followerData = followerDoc.data();
                return {
                    uid: followerUid,
                    firstName: followerData.first_name,
                    lastName: followerData.last_name
                };
            })
        );
        res.json(followerDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get following
app.get('/api/getFollowing/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        const following = userDoc.data().following || [];
        const followingDetails = await Promise.all(
            following.map(async (followingUid) => {
                const followingDoc = await db.collection('users').doc(followingUid).get();
                const followingData = followingDoc.data();
                return {
                    uid: followingUid,
                    firstName: followingData.first_name,
                    lastName: followingData.last_name
                };
            })
        );
        res.json("done");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/getReccomemdedUsers', async (req, res) => {
    const { uuid } = req.body;
    console.log("reccomemded\n",uuid)
    try {
        // Assuming you have a collection named 'uuidLists' where each document contains a list of UUIDs
        const snapshot = await db.collection('users').get();
  
        const uuidDoc = snapshot.docs.map(doc => doc.id);
        if (!(uuidDoc.includes(uuid ))) {
            console.log(uuidDoc)
            return res.status(404).send('UUID not found');
        }
        let reccomemdedUuid = []
        
        fetch('https://probable-rotary-phone-6j566gxq64qh5v6x-8080.app.github.dev/get_users_with_required_goals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: uuid,k:5 })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            reccomemdedUuid = data.top_user_ids ;
        res.json(reccomemdedUuid);

          })
          .catch((error) => {
            console.error('Error:', error);
          });
         
    } catch (error) {
        console.log("recerror")
        res.status(500).send(error.message);
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});