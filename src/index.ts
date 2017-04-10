import * as BodyParserCore from "body-parser";
import * as MulterCore from "multer";
import { Kanro } from "kanro";

declare module "kanro" {
    namespace Kanro {
        namespace Http {
            interface IRequest {
                body?: { [name: string]: any };
                file?: Express.Multer.File;
                files?: {
                    [fieldName: string]: Express.Multer.File[];
                };
            }
        }
    }
}

export namespace Body {
    export class BodyParser extends Kanro.Executors.BaseRequestHandler {
        async handler(request: Kanro.Http.IRequest): Promise<Kanro.Http.IRequest> {
            await new Promise((res, rej) => {
                BodyParserCore.json()(<any>request.meta, undefined, (err) => {
                    if (err) {
                        rej(err);
                        return;
                    }
                    request.body = request.meta["body"];
                    res();
                })
            });
            await new Promise((res, rej) => {
                BodyParserCore.urlencoded({ extended: true })(<any>request.meta, undefined, (err) => {
                    if (err) {
                        rej(err);
                        return;
                    }
                    request.body = request.meta["body"];
                    res();
                })
            });

            MulterCore({dest : "./resource/upload"})
            return request;
        }

        type: Kanro.Executors.ExecutorType.RequestHandler = Kanro.Executors.ExecutorType.RequestHandler;
        name: string = "BodyParser";

        constructor(config: Kanro.Containers.IRequestHandlerContainer) {
            super(config);
        }
    }

    export class BodyModule implements Kanro.Core.IModule {
        dependencies: Kanro.Core.IModuleInfo[];

        executorInfos: { [name: string]: Kanro.Executors.IExecutorInfo; };
        async getExecutor(config: Kanro.Containers.IExecutorContainer): Promise<Kanro.Executors.IExecutor> {
            if (config.name == "BodyParser") {
                return new BodyParser(<any>config);
            }
            return undefined;
        }

        public constructor() {
            this.executorInfos = { BodyParser: { type: Kanro.Executors.ExecutorType.RequestHandler, name: "BodyParser" } };
        }
    }
}

export let KanroModule = new Body.BodyModule(); 