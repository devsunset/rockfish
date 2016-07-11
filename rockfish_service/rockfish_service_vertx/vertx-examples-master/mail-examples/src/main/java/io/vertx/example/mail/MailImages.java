package io.vertx.example.mail;

import java.util.ArrayList;
import java.util.List;

import io.vertx.core.AbstractVerticle;
import io.vertx.example.util.Runner;
import io.vertx.ext.mail.MailAttachment;
import io.vertx.ext.mail.MailClient;
import io.vertx.ext.mail.MailConfig;
import io.vertx.ext.mail.MailMessage;

/**
 * send a mail with HTML and inline images
 *
 * @author <a href="http://oss.lehmann.cx/">Alexander Lehmann</a>
 */
public class MailImages extends AbstractVerticle {

  // Convenience method so you can run it in your IDE
  public static void main(String[] args) {
    Runner.runExample(MailImages.class);
  }

  @Override
  public void start() {
    // Start a local STMP server, remove this line if you want to use your own server.
    // It just prints the sent message to the console
    LocalSmtpServer.start(2526);

    MailClient mailClient = MailClient.createShared(vertx, new MailConfig().setPort(2526));

    MailMessage email = new MailMessage()
        .setFrom("user@example.com (Sender)")
        .setTo("user@example.com (User Name)")
        .setSubject("Test email")
        .setText("full message is readable as html only")
        .setHtml("visit vert.x <a href=\"http://vertx.io/\"><img src=\"cid:image1@example.com\"></a>");

    MailAttachment attachment = new MailAttachment()
        .setData(vertx.fileSystem().readFileBlocking("logo-white-big.png"))
        .setContentType("image/png")
        .setName("logo-white-big.png")
        .setDisposition("inline")
        .addHeader("Content-ID", "<image1@example.com>");

    List<MailAttachment> list=new ArrayList<>();
    list.add(attachment);
    email.setInlineAttachment(list);

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
