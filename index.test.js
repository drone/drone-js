import DroneClient from "./index";
import mock from "xhr-mock";
import assert from "assert";

mock.setup();

describe("Drone Client", () => {
	let client = new DroneClient("http://localhost", "password", "123456");

	afterEach(() => {
		mock.reset();
	});

	describe("_request", () => {
		it("should add the token header", done => {
			mock.get(/.*/, (req, res) => {
				assert(req.header("Authorization") === "Bearer password");
				done();
			});
			client
				._get()
				.then(() => {})
				.catch(() => {});
		});

		it("should add the csrf header", done => {
			mock.post(/.*/, (req, res) => {
				assert(req.header("X-CSRF-TOKEN") === "123456");
				done();
			});
			client
				._post()
				.then(() => {})
				.catch(() => {});
		});

		it("should not add the csrf header for GET", done => {
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

	describe("getSelf", () => {
		it("should fetch the user without error", done => {
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
	});
});
