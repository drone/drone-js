import DroneClient, { encodeQueryString } from "./index";
import mock from "xhr-mock";
import sinon from "sinon";
import assert from "assert";

mock.setup();

describe("Drone Client", () => {
	//
	// tests for client creation
	//

	describe("creates a new client", () => {
		it("with options", () => {
			let client = new DroneClient("http://localhost", "password", "123456");
			assert(client.server === "http://localhost");
			assert(client.token === "password");
			assert(client.csrf === "123456");
		});

		it("from the window", () => {
			global.window = {};
			global.window.DRONE_SERVER = "http://drone.company.com";
			global.window.DRONE_TOKEN = "password";
			global.window.DRONE_CSRF = "123456";

			let client = DroneClient.fromWindow();
			assert(client.server === "http://drone.company.com");
			assert(client.token === "password");
			assert(client.csrf === "123456");
		});

		it("from the window", () => {
			process.env.DRONE_SERVER = "http://drone";
			process.env.DRONE_TOKEN = "password";
			process.env.DRONE_CSRF = "123456";

			let client = DroneClient.fromEnviron();
			assert(client.server === "http://drone");
			assert(client.token === "password");
			assert(client.csrf === "123456");
		});
	});

	//
	// tests for individual API calls
	//

	describe("generates api endpoints", () => {
		let client;
		let mock;

		beforeEach(() => {
			client = new DroneClient();
			mock = sinon.mock(client);
		});

		it("getRepo", () => {
			mock
				.expects("_request")
				.withArgs("GET", "/api/repos/octocat/hello-world");
			client.getRepo("octocat", "hello-world");
			mock.verify();
		});

		it("getRepoList", () => {
			mock.expects("_request").withArgs("GET", "/api/user/repos?all=true");
			client.getRepoList({ all: true });
			mock.verify();
		});

		it("activateRepo", () => {
			mock
				.expects("_request")
				.withArgs("POST", "/api/repos/octocat/hello-world");
			client.activateRepo("octocat", "hello-world");
			mock.verify();
		});

		it("deleteRepo", () => {
			mock
				.expects("_request")
				.withArgs("DELETE", "/api/repos/octocat/hello-world");
			client.deleteRepo("octocat", "hello-world");
			mock.verify();
		});

		it("updateRepo", () => {
			let data = { visibility: "internal" };
			mock
				.expects("_request")
				.withArgs("PATCH", "/api/repos/octocat/hello-world", data);
			client.updateRepo("octocat", "hello-world", data);
			mock.verify();
		});

		it("getBuildList", () => {
			mock
				.expects("_request")
				.withArgs("GET", "/api/repos/octocat/hello-world/builds");
			client.getBuildList("octocat", "hello-world");
			mock.verify();
		});

		it("getBuild", () => {
			mock
				.expects("_request")
				.withArgs("GET", "/api/repos/octocat/hello-world/builds/1");
			client.getBuild("octocat", "hello-world", 1);
			mock.verify();
		});

		it("getBuildFeed", () => {
			mock.expects("_request").withArgs("GET", "/api/user/feed?latest=true");
			client.getBuildFeed({ latest: true });
			mock.verify();
		});

		it("cancelBuild", () => {
			mock
				.expects("_request")
				.withArgs("DELETE", "/api/repos/octocat/hello-world/builds/1/2");
			client.cancelBuild("octocat", "hello-world", 1, 2);
			mock.verify();
		});

		it("approveBuild", () => {
			mock
				.expects("_request")
				.withArgs("POST", "/api/repos/octocat/hello-world/builds/1/approve");
			client.approveBuild("octocat", "hello-world", 1);
			mock.verify();
		});

		it("declineBuild", () => {
			mock
				.expects("_request")
				.withArgs("POST", "/api/repos/octocat/hello-world/builds/1/decline");
			client.declineBuild("octocat", "hello-world", 1);
			mock.verify();
		});

		it("restartBuild", () => {
			mock
				.expects("_request")
				.withArgs("POST", "/api/repos/octocat/hello-world/builds/1?fork=true");
			client.restartBuild("octocat", "hello-world", 1, { fork: true });
			mock.verify();
		});

		it("getLogs", () => {
			mock
				.expects("_request")
				.withArgs("GET", "/api/repos/octocat/hello-world/logs/1/2");
			client.getLogs("octocat", "hello-world", 1, 2);
			mock.verify();
		});

		it("getArtifact", () => {
			mock
				.expects("_request")
				.withArgs(
					"GET",
					"/api/repos/octocat/hello-world/files/1/2/foo/bar.baz?raw=true",
				);
			client.getArtifact("octocat", "hello-world", 1, 2, "foo/bar.baz");
			mock.verify();
		});

		it("getArtifactList", () => {
			mock
				.expects("_request")
				.withArgs("GET", "/api/repos/octocat/hello-world/files/1");
			client.getArtifactList("octocat", "hello-world", 1);
			mock.verify();
		});

		it("getSecretList", () => {
			mock
				.expects("_request")
				.withArgs("GET", "/api/repos/octocat/hello-world/secrets");
			client.getSecretList("octocat", "hello-world");
			mock.verify();
		});

		it("createSecret", () => {
			let secret = { name: "docker_password", value: "password" };
			mock
				.expects("_request")
				.withArgs("POST", "/api/repos/octocat/hello-world/secrets", secret);
			client.createSecret("octocat", "hello-world", secret);
			mock.verify();
		});

		it("deleteSecret", () => {
			mock
				.expects("_request")
				.withArgs(
					"DELETE",
					"/api/repos/octocat/hello-world/secrets/docker_password",
				);
			client.deleteSecret("octocat", "hello-world", "docker_password");
			mock.verify();
		});

		it("getRegistryList", () => {
			mock
				.expects("_request")
				.withArgs("GET", "/api/repos/octocat/hello-world/registry");
			client.getRegistryList("octocat", "hello-world");
			mock.verify();
		});

		it("createRegistry", () => {
			let registry = { address: "docker.io" };
			mock
				.expects("_request")
				.withArgs("POST", "/api/repos/octocat/hello-world/registry", registry);
			client.createRegistry("octocat", "hello-world", registry);
			mock.verify();
		});

		it("deleteRegistry", () => {
			mock
				.expects("_request")
				.withArgs(
					"DELETE",
					"/api/repos/octocat/hello-world/registry/docker.io",
				);
			client.deleteRegistry("octocat", "hello-world", "docker.io");
			mock.verify();
		});

		it("getSelf", () => {
			mock.expects("_request").withArgs("GET", "/api/user");
			client.getSelf();
			mock.verify();
		});

		it("getToken", () => {
			mock.expects("_request").withArgs("POST", "/api/user/token");
			client.getToken();
			mock.verify();
		});

		it("on", () => {
			const callback = () => {};
			const options = { reconnect: true };
			mock.expects("_subscribe").withArgs("/stream/events", callback, options);
			client.on(callback);
			mock.verify();
		});

		it("stream", () => {
			const callback = () => {};
			const options = { reconnect: false };
			mock
				.expects("_subscribe")
				.withArgs("/stream/logs/octocat/hello-world/1/2", callback, options);
			client.stream("octocat", "hello-world", 1, 2, callback);
			mock.verify();
		});
	});

	//
	// test for http request creation
	//

	describe("generate requests", () => {
		let client = new DroneClient("http://localhost", "password", "123456");

		afterEach(() => {
			mock.reset();
		});

		it("with the token header", done => {
			mock.get(/.*/, (req, res) => {
				assert(req.header("Authorization") === "Bearer password");
				done();
			});
			client
				._get()
				.then(() => {})
				.catch(() => {});
		});

		it("with the csrf header", done => {
			mock.post(/.*/, (req, res) => {
				assert(req.header("X-CSRF-TOKEN") === "123456");
				done();
			});
			client
				._post()
				.then(() => {})
				.catch(() => {});
		});

		it("without the csrf header for GET", done => {
			mock.get(/.*/, (req, res) => {
				assert(!req.header("X-CSRF-TOKEN"));
				done();
			});
			client
				._get()
				.then(() => {})
				.catch(() => {});
		});

		it("with the json body", done => {
			mock.post(/.*/, (req, res) => {
				assert(req.header("Content-Type") === "application/json");
				assert(req.body() === `{"ping":"pong"}`);
				done();
			});
			client
				._post("http://localhost", { ping: "pong" })
				.then(() => {})
				.catch(() => {});
		});
	});

	//
	// tests for http request execution
	//

	describe("executes http requests", () => {
		let client = new DroneClient("http://localhost", "password", "123456");

		afterEach(() => {
			mock.reset();
		});

		it("unmarshals the json response", done => {
			mock.get("http://localhost/api/user", (req, res) => {
				return res
					.status(200)
					.header("Content-Type", "application/json")
					.body(JSON.stringify({ login: "octocat" }));
			});

			client
				.getSelf()
				.then(user => {
					assert(user.login === "octocat");
					done();
				})
				.catch(error => {
					done(error);
				});
		});

		it("unmarshals a plain text response", done => {
			mock.post("http://localhost/api/user/token", (req, res) => {
				return res
					.status(200)
					.header("Content-Type", "text/plain")
					.body("ZG9udCBnYWluIHRoZSB3b3JsZCBhbmQgbG9zZSB5b3VyIHNvdWw=");
			});

			client
				.getToken()
				.then(user => {
					assert("ZG9udCBnYWluIHRoZSB3b3JsZCBhbmQgbG9zZSB5b3VyIHNvdWw=");
					done();
				})
				.catch(error => {
					done(error);
				});
		});

		it("handles an error response", done => {
			mock.get("http://localhost/api/user", (req, res) => {
				return res
					.status(403)
					.header("Content-Type", "plain/text")
					.body("Not Authorized");
			});

			client
				.getSelf()
				.then(user => {
					done("expect error response");
				})
				.catch(error => {
					assert(error);
					assert(error.status === 403);
					assert(error.message === "Not Authorized");
					done();
				});
		});

		it("send error notifications to the listener", done => {
			mock.get("http://localhost/api/user", (req, res) => {
				return res
					.status(403)
					.header("Content-Type", "plain/text")
					.body("Not Authorized");
			});
			client.onerror = error => {
				assert(error.status === 403);
				assert(error.message === "Not Authorized");
				done();
			};
			client
				.getSelf()
				.then(() => {})
				.catch(() => {});
		});
	});

	//
	// tests for event source streaming
	//

	describe("event streams", () => {
		let client = new DroneClient("http://localhost", "password");

		it("with endpoint", () => {
			const sse = client.on(() => {});
			assert(
				sse.url() === "http://localhost/stream/events?access_token=password",
			);
		});

		it("sends events to callback function", done => {
			const sse = client.on(message => {
				assert(message);
				assert(message.login === "octocat");
				done();
			});
			sse.emitMessage({ data: `{"login":"octocat"}` });
		});

		it("closes the stream on eof", () => {
			const callback = () => {};
			const sse = client._subscribe("", callback, {reconnect: false});
			sse.emitError({ data: "eof" });
			assert(sse.closed());
		});
	});

	//
	// tests for building query parameters
	//

	describe("encodes query paraemeters", () => {
		it("handles no parameters", () => {
			assert(encodeQueryString() === "");
			assert(encodeQueryString({}) === "");
			assert(encodeQueryString(null) === "");
			assert(encodeQueryString(undefined) === "");
		});

		it("sorts parameters", () => {
			assert(encodeQueryString({ b: "b", a: "a" }) === "a=a&b=b");
		});

		it("returns an encoded string", () => {
			assert(encodeQueryString({ hello: "world" }) === "hello=world");
		});
	});
});

// simple mock object for EventSource
global.EventSource = class MockEventSource {
	constructor(url) {
		this._url = url;
	}
	url() {
		return this._url;
	}
	closed() {
		return this._closed;
	}
	close() {
		this._closed = true;
	}
	emitError(error) {
		this.onerror && this.onerror(error);
	}
	emitMessage(message) {
		this.onmessage && this.onmessage(message);
	}
};
