package io.vertx.example.core.http2.push;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientOptions;
import io.vertx.core.http.HttpClientRequest;
import io.vertx.core.http.HttpVersion;
import io.vertx.core.net.OpenSSLEngineOptions;
import io.vertx.example.util.Runner;

/*
 * @author <a href="http://tfox.org">Tim Fox</a>
 */
public class Client extends AbstractVerticle {

  // Convenience method so you can run it in your IDE
  public static void main(String[] args) {
    Runner.runExample(Client.class);
  }

  @Override
  public void start() throws Exception {

    // Note! in real-life you wouldn't often set trust all to true as it could leave you open to man in the middle attacks.

    HttpClientOptions options = new HttpClientOptions().
        setSsl(true).
        setUseAlpn(true).
        setProtocolVersion(HttpVersion.HTTP_2).
        setTrustAll(true);

    HttpClient client = vertx.createHttpClient(options);

    HttpClientRequest request = client.get(8443, "localhost", "/", resp -> {
      System.out.println("Got response " + resp.statusCode() + " with protocol " + resp.version());
      resp.bodyHandler(body -> System.out.println("Got data " + body.toString("ISO-8859-1")));
    });

    // Set handler for server side push
    request.pushHandler(pushedReq -> {
      System.out.println("Receiving pushed content");
      pushedReq.handler(pushedResp -> {
        pushedResp.bodyHandler(body -> System.out.println("Got pushed data " + body.toString("ISO-8859-1")));
      });
    });

    request.end();
  }
}
