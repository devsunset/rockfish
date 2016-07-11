package io.vertx.example.mail;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.buffer.Buffer;
import io.vertx.example.util.Runner;
import io.vertx.ext.mail.LoginOption;
import io.vertx.ext.mail.MailAttachment;
import io.vertx.ext.mail.MailConfig;
import io.vertx.ext.mail.MailMessage;
import io.vertx.ext.mail.MailClient;
import io.vertx.ext.mail.StartTLSOptions;

import java.util.ArrayList;
import java.util.List;

/**
 * send a mail via a smtp server requiring TLS and Login we use an attachment and a text/html alternative mail body
 * <p>
 * Please put in your actual mail server and account to run this example
 *
 * @author <a href="http://oss.lehmann.cx/">Alexander Lehmann</a>
 */
public class MailLogin extends AbstractVerticle {

  // Convenience method so you can run it in your IDE
  public static void main(String[] args) {
    Runner.runExample(MailLogin.class);
  }

  public void start() {
    // Start a local STMP server, remove this line if you want to use your own server.
    // It just prints the sent message to the console
    LocalSmtpServer.startWithAuth(5870);


    MailConfig mailConfig = new MailConfig()
      .setHostname("localhost")
      .setPort(5870)
      //.setStarttls(StartTLSOptions.REQUIRED)
      .setLogin(LoginOption.REQUIRED)
      .setAuthMethods("PLAIN")
      .setUsername("username")
      .setPassword("password");

    MailClient mailClient = MailClient.createShared(vertx, mailConfig);

    Buffer image = vertx.fileSystem().readFileBlocking("logo-white-big.png");

    MailMessage email = new MailMessage()
      .setFrom("user1@example.com")
      .setTo("user2@example.com")
      .setCc("user3@example.com")
      .setBcc("user4@example.com")
      .setBounceAddress("bounce@example.com")
      .setSubject("Test email with HTML")
      .setText("this is a message")
      .setHtml("<a href=\"http://vertx.io\">vertx.io</a>");

    List<MailAttachment> list = new ArrayList<MailAttachment>();

    list.add(new MailAttachment()
      .setData(image)
      .setName("logo-white-big.png")
      .setContentType("image/png")
      .setDisposition("inline")
      .setDescription("logo of vert.x web page"));

    email.setAttachment(list);

    mailClient.sendMail(email, result -> {
      if (result.succeeded()) {
        System.out.println(result.result());
        System.out.println("Mail sent");
      } else {
        System.out.println("got exception");
        result.cause().printStackTrace();
      }
    });
  }

}
