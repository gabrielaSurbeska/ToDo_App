import { Application, Context, Router, send } from "./deps.ts";
import { renderFileToString } from "./deps.ts";

interface Task {
    name: string;
    date: Date;
    description: string;
}

const app = new Application();
const router = new Router();

let tasks: Task[] = [];


router.get("/", async (ctx: Context) => {
    const today = new Date().toDateString();
    const body = await renderFileToString("./views/index.ejs", { tasks, today, index: ctx.params.index });
    ctx.response.body = body;
});


router.post("/add", async (ctx: Context) => {
    const formData = await ctx.request.body().value;
    const name = formData.get("name");
    const taskDate = formData.get("taskDate");
    const description = formData.get("description");

    console.log("Received form data:", name, taskDate, description);

        if (name && taskDate && description) {
            const date = new Date(taskDate);
            const task: Task = { name, date, description };
            tasks.push(task);
        }
        ctx.response.redirect("/");
    });
router.post("/delete", async (ctx: Context) => {
    const formData = await ctx.request.body().value;
    const taskIndex = formData.get("taskIndex");
    console.log("Received delete request for taskIndex:", taskIndex);

    if (taskIndex) {
        const index = parseInt(taskIndex, 10);
        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            console.log("Task deleted:", tasks);
        }
    }
    ctx.response.redirect("/");
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}/static`,
        index: "index.html",
    });
});

console.log("Server is running on http://localhost:3000");
await app.listen({ port: 3000 });
