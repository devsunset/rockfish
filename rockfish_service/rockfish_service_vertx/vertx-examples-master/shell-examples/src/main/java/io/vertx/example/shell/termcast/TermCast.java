package io.vertx.example.shell.termcast;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.example.util.Runner;
import io.vertx.ext.shell.term.TelnetTermOptions;
import io.vertx.ext.shell.term.TermServer;

import java.awt.*;

/**
 * @author <a href="mailto:julien@julienviet.com">Julien Viet</a>
 */
public class TermCast extends AbstractVerticle {

  // Convenience method so you can run it in your IDE
  public static void main(String[] args) {
    Runner.runExample(TermCast.class);
  }

  private TermServer termServer;

  @Override
  public void start(Future<Void> startFuture) throws Exception {
    termServer = TermServer.createTelnetTermServer(vertx, new TelnetTermOptions().setHost("localhost").setPort(3000).setInBinary(false));
    Robot robot = new Robot();
    termServer.termHandler(term -> {
      new ScreenCaster(vertx, robot, term).handle();
    });
    termServer.listen(ar -> {
      if (ar.succeeded()) {
        startFuture.complete();
      } else {
        startFuture.fail(ar.cause());
      }
    });
  }

  @Override
  public void stop() throws Exception {
    termServer.close();
  }
}
