# Vert.x Docker Example for Fabric8

This project builds a docker image launching a very simple Vert.x verticle that you can deploy to [Kubernetes](http://kubernetes.io/) using the [Fabric8](http://fabric8.io/) [maven plugin](http://fabric8.io/guide/mavenPlugin.html).

Also check the Openshift 3 examples that illustrates how to run Vert.x application, clustered application and service
 discovery in Kubernetes environment (https://github.com/vert-x3/vertx-examples/tree/master/openshift3-examples).
 
# Build the image

To build the docker image, just launch:

```
mvn clean package docker:build
```

Notice that you need to have docker installed on your machine.

# Setup Kubernetes / OpenShift / Atomic

If you want to try an existing OpenShift V3 environment that someone setup for you, then just type:

    oc login
    
To login to the OpenShift server.
    
Otherwise if you want to spin up your own Kubernetes installation on your laptop then follow the [Fabric8 getting started guide using Vagrant](http://fabric8.io/guide/getStartedVagrant.html)     

# Deployment on Kubernetes

The build creates the `kubernates.json` file with the required metadata in `target/classes`.

Build and deploy using:

```
mvn clean package fabric8:json docker:build fabric8:apply
```

## Pushing the image

This step is only required if you are using a remote Kubernetes cluster. If you are running the [Fabric8 Vagrant image](http://fabric8.io/guide/getStartedVagrant.html) locally and have your `DOCKER_HOST` pointed to the docker daemon inside the vagrant image then you don't need to push!
    
If you are using a remote Kubernetes cluster you need to push the docker image to a Docker registry that Kubernetes can access:

`docker push $DOCKER_REGISTRY/vertx/vertx3-example-fabric8`

## Applying the JSON to Kubernetes

To apply the generated `kubernates.json` file we use the [fabric8:apply](http://fabric8.io/guide/mavenFabric8Apply.html) maven goal:

`mvn fabric8:apply`

This tends to use the `$KUBERNETES_DOMAIN` environment variable to define the host name you'll use to access it.

## Trying it out

You should see in the [Fabric8 console](http://fabric8.io/guide/console.html) an entry for the newly created Service and Replication Controller.
 
If you switch to the `Services` tab you should see the new service for your app at the bottom of the page. 

![Alt text](/docker-examples/vertx-docker-example-fabric8/docs/img/servicesTab.png?raw=true "Services Tab in Fabric8 Console")
 
This [kubernetes service](http://fabric8.io/guide/services.html) provides a load balancer over all the running pods of your docker image.

You should be able to click the link on this page - e.g. `http://vertx-docker-example.vagrant.f8/` which should open a new browser tab with this output:

```
Hello World!
```

## Scaling your app

You can scale up/down how many docker containers you want to run by clicking the `Replicas` number on the `Controllers` tab (or click on the controller then hit the `Resize` button on the controller detail page).

![Alt text](/docker-examples/vertx-docker-example-fabric8/docs/img/resizeControllerTab.png?raw=true "Controllers Tab in Fabric8 Console")

## Integration testing your app

If you want to run integration tests of your app on Kubernetes (with maybe other apps and services on kubernetes too) you can use the [Fabric8 Arquillian plugin](http://fabric8.io/guide/testing.html) which lets you write regular JUnit test cases which spin up a new Kubernetes namespace, provision all the services, replication controllers and pods required and then runs your test case - then tears everything down again.

## Monitoring your app

When you have a few containers running inside Kubernetes it can be tricky understanding how your application is behaving.

So you might want to run these apps too to help give you more insight into how your containers are behaving:

* [Metrics](http://fabric8.io/guide/metrics.html) using [InfluxDB](https://influxdb.com/) as the back end and [Grafana](http://grafana.org/) as the front end 
* [Logging](http://fabric8.io/guide/logging.html) using [Elasticsearch](https://www.elastic.co/products/elasticsearch/) as the back end and [Kibana](https://www.elastic.co/products/kibana/) as the front end

If you [run](http://fabric8.io/guide/fabric8OnOpenShift.html#install-via-the-console) either of the above (via the `Run...` button on the `Apps` tab in the console) then you should see links to `Metrics` and `Logs` in the [Fabric8 console](http://fabric8.io/guide/console.html) where you can noodle the metrics and logs of all your containers. 