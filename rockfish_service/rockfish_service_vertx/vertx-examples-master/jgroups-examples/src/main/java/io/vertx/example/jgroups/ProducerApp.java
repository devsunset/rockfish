package io.vertx.example.jgroups;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;

/**
 * @author <a href="http://escoffier.me">Clement Escoffier</a>
 */
public class ProducerApp extends AbstractVerticle {

  public static void main(String[] args) {
    String ip = NetworkUtils.getInterface();
    if (args.length == 1) {
      ip = args[0];
    }
    System.out.println("Using interface: " + ip);

    System.setProperty("jgroups.bind_addr", ip);
    Vertx.clusteredVertx(new VertxOptions().setClustered(true).setClusterHost(ip), ar -> {
      if (ar.failed()) {
        System.err.println("Cannot create vert.x instance : " + ar.cause());
      } else {
        Vertx vertx = ar.result();
        vertx.deployVerticle(ProducerApp.class.getName());
      }
    });
  }

  @Override
  public void start() throws Exception {
    vertx.setPeriodic(3000, x -> {
      System.out.println("Sending data to 'news'");
      vertx.eventBus().send("news", "hello vert.x");
    });
  }
}
