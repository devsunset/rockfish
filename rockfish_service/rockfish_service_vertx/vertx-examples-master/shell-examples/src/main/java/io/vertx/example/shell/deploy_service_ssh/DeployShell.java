package io.vertx.example.shell.deploy_service_ssh;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.example.util.Runner;

/**
 * @author <a href="mailto:julien@julienviet.com">Julien Viet</a>
 */
public class DeployShell extends AbstractVerticle {

  // Convenience method so you can run it in your IDE
  public static void main(String[] args) {
    Runner.runExample(DeployShell.class);
  }

  @Override
  public void start(Future<Void> startFuture) throws Exception {
    JsonObject options = new JsonObject().put("sshOptions",
        new JsonObject().
            put("host", "localhost").
            put("port", 3000).
            put("keyPairOptions", new JsonObject().
                put("path", "keystore.jks").
                put("password", "wibble")).
            put("authOptions", new JsonObject().put("provider", "shiro").put("config",
                    new JsonObject().put("properties_path", "auth.properties"))

            )
    );
    vertx.deployVerticle("service:io.vertx.ext.shell", new DeploymentOptions().setConfig(options), ar -> {
      if (ar.succeeded()) {
        startFuture.succeeded();
      } else {
        startFuture.fail(ar.cause());
      }
    });
  }
}
