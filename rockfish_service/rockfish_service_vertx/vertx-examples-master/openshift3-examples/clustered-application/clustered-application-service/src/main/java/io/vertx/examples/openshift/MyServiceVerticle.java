package io.vertx.examples.openshift;

import io.vertx.core.AbstractVerticle;
import io.vertx.ext.web.Router;

public class MyServiceVerticle extends AbstractVerticle {

  @Override
  public void start() throws Exception {
    vertx.eventBus().<String>consumer("request", message -> {
       message.reply("hello " + message.body());
    });

    vertx.createHttpServer()
        .requestHandler(request -> request.response().end("OK"))
        .listen(8080);

  }
}
