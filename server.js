import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


const db = knex ({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'raj',
    password : '03052004',
    database : 'face recognition project'
    }
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password, 10);
        db.transaction(trx => {
            trx.insert({
                email: email,
                hash: hash
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
        })
        .catch(err => res.send('user name already exists'));
        
})

app.post('/signin', (req, res) => {
    
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return(
                db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.status(200).send(user[0]);
                })
                .catch(err => {res.status(400).send('unable to get request')})
            );
        }
        else {
            return res.send('wrong credentials');
        }
    })
    .catch(err => res.send('Invalid user name or password'));
})

app.put('/image', (req, res) => {
    db('users').where('id', '=', req.body.id)
    .increment('entries', 1).returning('entries')
    .then(Entries => res.send(Entries))
    .catch(err => res.send(err));
})


app.listen(9999, () => {
    console.log('app is running!!!')
});