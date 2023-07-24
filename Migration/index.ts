import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

const app = new Application();
const PORT = 3000;

// Middleware
app.use(async (ctx, next) => {
    await next();
    if (ctx.request.hasBody) {
        const body = await ctx.request.body();
        if (body.value._method && body.value && body) {
            ctx.request.method = body.value._method;
            delete body.value._method;
        }
    }
});

// Mock tasks array
let tasks = [];

// Routes
const router = new Router();

router.get('/', (ctx) => {
    const today = new Date().toLocaleDateString();
    ctx.render('index.ejs', { tasks, today });
});

router.post('/', async (ctx) => {
    const { name, taskDate, description } = await ctx.request.body().value;
    const [year, month, day] = taskDate.split('-');
    const task = {
        name,
        date: new Date(year, month - 1, day),
        description,
    };
    tasks.push(task);
    ctx.response.redirect('/');
});

router.delete('/', async (ctx) => {
    const { taskIndex } = await ctx.request.body().value;
    tasks.splice(taskIndex, 1);
    ctx.response.redirect('/');
});

// Set EJS as the view engine
app.use(async (ctx, next) => {
    ctx.render = async (view: string, data: Record<string, any>) => {
        const body = Deno.readFileSync(view);
        const decoder = new TextDecoder();
        const viewContent = decoder.decode(body);
        const html = viewContent.replace(/<%=([\s\S]+?)%>/g, (_, code) => {
            const value = new Function('data', `with(data) { return ${code} }`)(data);
            return String(value);
        });
        ctx.response.headers.set('Content-Type', 'text/html');
        ctx.response.body = html;
    };
    await next();
});

app.use(router.routes());

// Start the server
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });

