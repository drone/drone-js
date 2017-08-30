import DroneClient from "./index";
import mock from "xhr-mock";
import sinon from "sinon";
import assert from "assert";

mock.setup();

describe("Drone Client", () => {
	describe("should generate requests", () => {
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
	});

	describe("should generate api endpoints", () => {
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
			mock.expects("_request").withArgs("GET", "/api/user/repos");
			client.getRepoList();
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

		it("getBuildFeed");

		it("cancelBuild");

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

		it("restartBuild");

		it("getLogs");

		it("getArtifact");

		it("getArtifactList");

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
	});

	// describe("getSelf", () => {
	// 	it("should fetch the user without error", done => {
	// 		mock.get("http://localhost/api/user", (req, res) => {
	// 			return res
	// 				.status(200)
	// 				.header("Content-Type", "application/json")
	// 				.body(JSON.stringify({ login: "octocat" }));
	// 		});
	//
	// 		client
	// 			.getSelf()
	// 			.then(user => {
	// 				assert(user.login === "octocat");
	// 				done();
	// 			})
	// 			.catch(error => {
	// 				done(error);
	// 			});
	// 	});
	// });
});
