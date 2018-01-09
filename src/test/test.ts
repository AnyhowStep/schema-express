import * as schema from "schema-decorator";
import * as validation from "@anyhowstep/data-validation";
import * as schemaExpress from "../main/index";
import * as express from "express";
import * as http from "http";

class Parameter {
    @schema.assert(schema.stringToNaturalNumber())
    id : number = 1;
}
class Body {
    @schema.assert(validation.Number.assertNaturalNumber)
    userId : number = 1;
    @schema.assert(validation.String.assertNonEmpty)
    title : string = "-";
    @schema.assert(validation.String.assertNonEmpty)
    body : string = "-";
}
class Title {
    @schema.assert(validation.String.assertNonEmpty)
    title : string = "-";
}
class Response {
    @schema.assert(validation.Number.assertNaturalNumber)
    userId : number = 1;
    @schema.assert(validation.Number.assertNaturalNumber)
    id : number = 1;
    @schema.assert(validation.String.assertNonEmpty)
    title : string = "-";
    @schema.assert(validation.String.assertNonEmpty)
    body : string = "-";
}
class Comment {
    @schema.assert(validation.Number.assertNaturalNumber)
    postId : number = 1;
    @schema.assert(validation.Number.assertNaturalNumber)
    id : number = 1;
    @schema.assert(validation.String.assertNonEmpty)
    name : string = "-";
    @schema.assert(validation.String.assertEmail)
    email : string = "-@-";
    @schema.assert(validation.String.assertNonEmpty)
    body : string = "-";
}
class CommentQuery {
    @schema.assert(schema.stringToNaturalNumber())
    postId : number = 1;
}

const fetchPost = schema.Route.Create()
    .append("/posts")
    .appendParam("id", /\d+/)
    .param(Parameter)
    .response(Response);

const app = new schemaExpress.App()
    .use<{ fromApp : true }>((_req, _res, next) => {
        next(undefined, {
            fromApp : true,
        })
    })
    .useVoid(express.json());

const r = app.createRouter();
r.add(fetchPost)
    .handler<{ title : string, body : string }>((_req, _res, next) => {
        //Middleware can now be typed
        next(undefined, {
            title : "Hello",
            body : "Lorem ipsum",
        });
    })
    .voidHandler((req, res) => {
        //Responses are typed, too.
        //Statically, and during run time.
        res.json({
            userId : 1,
            id : req.params.id,
            title : res.locals.title,
            body : res.locals.body,
        });
    })
    .build();

const fetchAllPosts = schema.Route.Create()
    .append("/posts")
    .responseDelegate(schema.array(schema.nested(Response)));

r.add(fetchAllPosts)
    .voidHandler((_req, res) => {
        const result : Response[] = [];
        for (let i=0; i<10; ++i) {
            result.push({
                userId : i,
                id : i,
                title : `This is title ${i}`,
                body : `This is body #${i}`,
            });
        }
        res.json(result);
    })
    .build();

const createPost = schema.Route.Create()
    .append("/posts")
    .body(Body)
    .response(Response);

r.add(createPost)
    .voidHandler((req, res) => {
        res.json({
            userId : req.body.userId,
            id : Math.floor(Math.random() * 100),
            title : req.body.title,
            body : req.body.body,
        });
    })
    .build();

const del = schema.Route.Create()
        .append("/posts")
        .appendParam("id", /\d+/)
        .param(Parameter)
        .method("DELETE");

r.add(del)
    .voidHandler((_req, res) => {
        res.status(204).end();
    })
    .build();

const updatePost = schema.Route.Create()
    .method("PUT")
    .append("/posts")
    .appendParam("id", /\d+/)
    .param(Parameter)
    .body(Response)
    .response(Response);

r.add(updatePost)
    .voidHandler((req, res) => {
        res.json({
            userId : req.body.userId,
            id : req.body.id,
            title : req.body.title,
            body : req.body.body,
        });
    })
    .build();

const patch = schema.Route.Create()
        .append("/posts")
        .appendParam("id", /\d+/)
        .param(Parameter)
        .body(Title)
        .response(Response)
        .method("PATCH");

r.add(patch)
    .voidHandler((req, res) => {
        res.json({
            userId : 1,
            id : req.params.id,
            title : req.body.title,
            body : "Some body",
        });
    })
    .build();

const getCommentsOfPost = schema.Route.Create()
    .append("/comments")
    .query(CommentQuery)
    .responseDelegate(schema.array(schema.nested(Comment)));

r.add(getCommentsOfPost)
    .voidHandler((req, res) => {
        const result : Comment[] = [];
        for (let i=0; i<10; ++i) {
            result.push({
                postId : req.query.postId,
                id : i,
                name : `Commenter #${i}`,
                email : `example+${i}@example.com`,
                body : `This is comment #${i}`,
            });
        }
        res.json(result);
    })
    .build();

r.build(); //Or, app.useVoid(r.getRawRouter())

app.get("/test", (_req, res) => {
    res.json({
        Hello : "World",
        fromApp : res.locals.fromApp,
    });
});
app.useVoid((err : any, _req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (err) {
        res.status(400).json({
            error : err.message,
        });
    } else {
        next();
    }
});
http.createServer(app.getRawApp()).listen(7777, () => {
    console.log("Test started");
});
