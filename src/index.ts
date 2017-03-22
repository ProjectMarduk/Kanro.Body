import * as BodyParserCore from "body-parser";
import { Kanro } from "kanro.core";

export namespace Body {
    export class BodyParser extends Kanro.BaseRequestHandler {
        async handler(request: Kanro.Core.IRequest): Promise<Kanro.Core.IRequest> {
            await new Promise((res, rej) => {
                BodyParserCore.json()(<any>request.meta, undefined, (err) => {
                    if(err){
                        rej(err);
                        return;
                    }
                    request["body"] = request.meta["body"];
                    res();
                })
            });
            await new Promise((res, rej) => {
                BodyParserCore.urlencoded({extended : true})(<any>request.meta, undefined, (err) => {
                    if(err){
                        rej(err);
                        return;
                    }
                    request["body"] = request.meta["body"];
                    res();
                })
            });
            return request;
        }

        type: Kanro.Core.ExecutorType.RequestHandler = Kanro.Core.ExecutorType.RequestHandler;
        name: string = "BodyParser";

        constructor(config: Kanro.Config.IRequestHandlerConfig) {
            super(config);
        }
    }

    export class BodyModule implements Kanro.Core.IModule {
        dependencies: Kanro.Core.IModuleInfo[];

        executorInfos: { [name: string]: Kanro.Core.IExecutorInfo; };
        async getExecutor(config: Kanro.Config.IExecutorConfig): Promise<Kanro.Core.IExecutor> {
            if (config.name == "BodyParser") {
                return new BodyParser(<any>config);
            }
            return undefined;
        }

        public constructor() {
            this.executorInfos = { BodyParser: { type: Kanro.Core.ExecutorType.RequestHandler, name: "BodyParser" } };
        }
    }
}

export let KanroModule = new Body.BodyModule(); 