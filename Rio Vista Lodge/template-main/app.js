

const express = require('express');
const session = require('express-session');
const app = express();
// Set EJS as templating engine 
app.set('view engine', 'ejs');
const path = require('path');
//const { type } = require('os');
//const methodOverride = require('method-override');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(
    session({

        // It holds the secret key for session
        secret: "AbClkjfdlksa;fjieod",
        // Forces the session to be saved
        // back to the session store
        resave: true,

        // Forces a session that is "uninitialized"
        // to be saved to the store
        saveUninitialized: false,
        cookie: {

            // Session expires after 1 min of inactivity.
            expires: 60000 * 60 * 24
        }
    })
);
app.use(express.static(__dirname + '/public'));

const OpenAI = require('openai');
const { symlinkSync } = require('fs');
const { error } = require('console');
const { name } = require('ejs');
const { threadId } = require('worker_threads');
const openai = new OpenAI({ apiKey: 'sk-proj-5ESnrdeY8DF639S8sEBZT3BlbkFJfdDRTnnEtxfJHyu7p7dn' });


async function GetAssistantName(id) {
    var Assistant = await openai.beta.assistants.retrieve(
        id
    );

    return Assistant.name

}
const assistantId = 'asst_exN0vCTUXIIRmIynu1ouPaaN'

app.get('/', async (req, res) => {
    let testarr = [];
    let ArrId = []
    var AssistantName = await GetAssistantName(assistantId)

    let assistantimg = '/AssistantImages/' + assistantId + '.jpeg'
    res.render('page', { testarr: testarr, assistantimg: assistantimg, AssistantName: AssistantName, ArrId: ArrId, formLink: '/' })

});


app.post('/', async (req, res) => {
    const formLink = '/'

    try {

        // create a thread

        var thread = await openai.beta.threads.create();
        let threadId
        threadId = thread.id;

        //var
        let ArrId = []
        let testarr = []
        // /////////gptmcode////////////////////////////////
        const submittext1 = req.body.testvalue;
        console.log(threadId);
        var message =
            await openai.beta.threads.messages.create(
                threadId,
                {
                    role: "user",
                    content: submittext1
                }
            );
        console.log(assistantId);

        var run1 = await openai.beta.threads.runs.createAndPoll(
            threadId,
            {
                assistant_id: assistantId,
            }
        );

        if (run1.status === 'completed') {
            var messages = await openai.beta.threads.messages.list(
                threadId
            );

            for (const message of messages.data.reverse()) {
                console.log(`${message.role} > ${message.content[0].text.value}`);
                testarr.push(message.content[0].text.value)

                if (message.assistant_id == null) {
                    ArrId.push('null')
                    console.log(message.assistantId + '""""""""""""""""""""""""""""""""""""""""""""""')
                } else {
                    console.log(message.assistant_id + ']]]]]]]]]]]]]]]]]]]]]]]]]]]')
                    ArrId.push(message.assistant_id)
                }

            }
            let assistantimg = '/AssistantImages/' + assistantId + '.jpeg'
            var AssistantName = await GetAssistantName(assistantId)
            res.redirect('/t/' + threadId)

            // res.render('page', { val: '', testarr: testarr, assistantimg: assistantimg, AssistantName: AssistantName, ArrId: ArrId })
        } else {
            testarr = []
            ArrId = []
            console.log(run1.status);
            messagearr.push('something went wrong. Please Email support@smartstudyrsa.co.za');
            messagearr.push('something went wrong. Please Email support@smartstudyrsa.co.za');
            var AssistantName = await GetAssistantName(assistantId)
            let assistantimg = '/AssistantImages/' + assistantId + '.jpeg'

            console.log(run1.status)
            console.log(run1.error)
            res.render('page', { val: '', testarr: testarr, assistantimg: assistantimg, AssistantName: AssistantName, ArrId: ArrId, formLink: formLink })
        }



    } catch (e) {
        console.log('ERROR')
        console.log({ e })
        res.render('error', { e: e })
    }

});


app.get('/t/:id', async (req, res) => {

    const Threadid = req.params.id;

    //retrieve mesagges in thread
    var messages = await openai.beta.threads.messages.list(
        Threadid
    );
    let testarr = []
    let ArrId = []
    for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
        testarr.push(message.content[0].text.value)


        if (message.assistant_id == null) {
            ArrId.push('null')
            console.log(message.assistantId + '""""""""""""""""""""""""""""""""""""""""""""""')
        } else {
            console.log(message.assistant_id + ']]]]]]]]]]]]]]]]]]]]]]]]]]]')
            ArrId.push(message.assistant_id)
        }

    }
    const formLink = '/t/' + Threadid

    let assistantimg = '/AssistantImages/' + assistantId + '.jpeg'
    var AssistantName = await GetAssistantName(assistantId)
    res.render('page', { val: '', testarr: testarr, assistantimg: assistantimg, AssistantName: AssistantName, ArrId: ArrId, formLink: formLink })


})

app.post('/t/:id', async (req, res) => {
    //var
    const threadId = req.params.id
    const formLink = '/t/' + threadId
    // /////////gptmcode////////////////////////////////
    const submittext1 = req.body.testvalue;
    console.log(threadId);
    try {
        let ArrId = []
        let testarr = []
        var message =
            await openai.beta.threads.messages.create(
                threadId,
                {
                    role: "user",
                    content: submittext1
                }
            );
        console.log(assistantId);

        var run1 = await openai.beta.threads.runs.createAndPoll(
            threadId,
            {
                assistant_id: assistantId,
            }
        );

        if (run1.status === 'completed') {
            var messages = await openai.beta.threads.messages.list(
                threadId
            );

            for (const message of messages.data.reverse()) {
                console.log(`${message.role} > ${message.content[0].text.value}`);
                testarr.push(message.content[0].text.value)

                if (message.assistant_id == null) {
                    ArrId.push('null')
                    console.log(message.assistantId + '""""""""""""""""""""""""""""""""""""""""""""""')
                } else {
                    console.log(message.assistant_id + ']]]]]]]]]]]]]]]]]]]]]]]]]]]')
                    ArrId.push(message.assistant_id)
                }

            }
            let assistantimg = '/AssistantImages/' + assistantId + '.jpeg'
            var AssistantName = await GetAssistantName(assistantId)

            res.render('page', { formLink: formLink, testarr: testarr, assistantimg: assistantimg, AssistantName: AssistantName, ArrId: ArrId })
        } else {
            testarr = []
            ArrId = []
            console.log(run1.status);
            messagearr.push('something went wrong. Please Email support@smartstudyrsa.co.za');
            messagearr.push('something went wrong. Please Email support@smartstudyrsa.co.za');
            var AssistantName = await GetAssistantName(assistantId)
            let assistantimg = '/AssistantImages/' + assistantId + '.jpeg'

            console.log(run1.status)
            console.log(run1.error)
            res.render('page', { formLink: formLink, testarr: testarr, assistantimg: assistantimg, AssistantName: AssistantName, ArrId: ArrId })
        }



    } catch (e) {
        console.log('ERROR')
        console.log({ e })
        res.render('error', { e: e })
    }
})




app.get('/clear', async (req, res) => {
    res.redirect('/')
})


app.post('/clear', async (req, res) => {
    res.redirect('/')

});



const server = app.listen(4000, function () {
    console.log('listening to port 4000')
});
