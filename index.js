export default class DroneClient {
	constructor(server, token, csrf) {
		this.server = server || "";
		this.token = token;
		this.csrf = csrf;
	}

	static fromEnviron() {
		return new DroneClient(
			process && process.env && process.env.DRONE_SERVER,
			process && process.env && process.env.DRONE_TOKEN,
			process && process.env && process.env.DRONE_CSRF,
		);
	}

	static fromWindow() {
		return new DroneClient(
			window && window.DRONE_SERVER,
			window && window.DRONE_TOKEN,
			window && window.DRONE_CSRF,
		);
	}

	/**
	 * Returns the user repository list.
	 */
	getRepoList(opts) {
		const query = encodeQueryString(opts);
		return this._get(`/api/user/repos?${query}`);
	}

	/**
	 * Returns the repository by owner and name.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	getRepo(owner, repo) {
		return this._get(`/api/repos/${owner}/${repo}`);
	}

	/**
	 * Activates the repository by owner and name.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	activateRepo(owner, repo) {
		return this._post(`/api/repos/${owner}/${repo}`);
	}

	/**
	 * Updates the repository.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {Object} repository data.
	 */
	updateRepo(owner, repo, data) {
		return this._patch(`/api/repos/${owner}/${repo}`, data);
	}

	/**
	 * Deletes the repository by owner and name.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	deleteRepo(owner, repo) {
		return this._delete(`/api/repos/${owner}/${repo}`);
	}

	/**
	 * Returns the build list for the given repository.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	getBuildList(owner, repo) {
		return this._get(`/api/repos/${owner}/${repo}/builds`);
	}

	/**
	 * Returns the build by number for the given repository.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	getBuild(owner, repo, number) {
		return this._get(`/api/repos/${owner}/${repo}/builds/${number}`);
	}

	/**
	 * returns the build feed for the user account.
	 *
	 * @param {Object} request options.
	 */
	getBuildFeed(opts) {
		const query = encodeQueryString(opts);
		return this._get(`/api/user/feed?${query}`);
	}

	/**
	 * Cancels the build by number for the given repository.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {number} process number.
	 */
	cancelBuild(owner, repo, number, ppid) {
		return this._delete(`/api/repos/${owner}/${repo}/builds/${number}/${ppid}`);
	}

	/**
	 * Approves the build.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	approveBuild(owner, repo, build) {
		return this._post(`/api/repos/${owner}/${repo}/builds/${build}/approve`);
	}

	/**
	 * Approves the build.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	declineBuild(owner, repo, build) {
		return this._post(`/api/repos/${owner}/${repo}/builds/${build}/decline`);
	}

	/**
	 * Restarts the build by number for the given repository.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {Object} request options
	 */
	restartBuild(owner, repo, build, opts) {
		const query = encodeQueryString(opts);
		return this._post(`/api/repos/${owner}/${repo}/builds/${build}?${query}`);
	}

	/**
	 * Returns the build by number for the given repository.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {number} proc number.
	 */
	getLogs(owner, repo, build, proc) {
		return this._get(`/api/repos/${owner}/${repo}/logs/${build}/${proc}`);
	}

	/**
	 * Returns the build artifact.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {number} process number.
	 * @param {String} file name.
	 */
	getArtifact(owner, repo, build, proc, file) {
		return this._get(
			`/api/repos/${owner}/${repo}/files/${build}/${proc}/${file}?raw=true`,
		);
	}

	/**
	 * Returns the build artifact.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	getArtifactList(owner, repo, build) {
		return this._get(`/api/repos/${owner}/${repo}/files/${build}`);
	}

	/**
	 * Returns the repository secret list.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	getSecretList(owner, repo) {
		return this._get(`/api/repos/${owner}/${repo}/secrets`);
	}

	/**
	 * Create the named registry.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {Object} secret details.
	 */
	createSecret(owner, repo, secret) {
		return this._post(`/api/repos/${owner}/${repo}/secrets`, secret);
	}

	/**
	 * Deletes the named repository secret.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {string} secret name.
	 */
	deleteSecret(owner, repo, secret) {
		return this._delete(`/api/repos/${owner}/${repo}/secrets/${secret}`);
	}

	/**
	 * Returns the repository registry list.
	 *
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	getRegistryList(owner, repo) {
		return this._get(`/api/repos/${owner}/${repo}/registry`);
	}

	/**
	 * Create the named registry.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} registry details.
	 */
	createRegistry(owner, repo, registry) {
		return this._post(`/api/repos/${owner}/${repo}/registry`, registry);
	}

	/**
	 * Deletes the named registry.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} registry address.
	 */
	deleteRegistry(owner, repo, address) {
		return this._delete(`/api/repos/${owner}/${repo}/registry/${address}`);
	}

	/**
	 * Returns the currently authenticated user.
	 */
	getSelf() {
		return this._get("/api/user");
	}

	/**
	 * Returns the user's personal API token.
	 */
	getToken() {
		return this._post("/api/user/token");
	}

	/*
	 * Subscribes to a server-side event feed and emits
	 * events to the callback receiver.
	 *
	 * @param {Function} callback function
	 * @return {Object} websocket
	 */
	on(receiver) {
		var endpoint = [this.server, "/stream/events"].join("");
		endpoint = this.token ? endpoint + "?access_token=" + this.token : endpoint;

		var events = new EventSource(endpoint);
		events.onmessage = function(event) {
			var data = JSON.parse(event.data);
			receiver(data);
		};
		return events;
	}

	/*
	 * Subscribes to an server-side event feed and emits
	 * events to the callback receiver.
	 *
	 * @param {Function} callback function
	 * @return {Object} websocket
	 */
	stream(owner, repo, build, proc, receiver) {
		var endpoint = [this.server, "stream/logs", owner, repo, build, proc].join(
			"/",
		);
		endpoint = this.token ? endpoint + "?access_token=" + this.token : endpoint;

		var events = new EventSource(endpoint);
		events.onerror = function(err) {
			if (err.data === "eof") {
				events.close();
			}
		};
		events.onmessage = function(event) {
			var data = JSON.parse(event.data);
			receiver(data);
		};
		return events;
	}

	_get(path) {
		return this._request("GET", path, null);
	}

	_post(path, data) {
		return this._request("POST", path, data);
	}

	_patch(path, data) {
		return this._request("PATCH", path, data);
	}

	_delete(path) {
		return this._request("DELETE", path, null);
	}

	_request(method, path, data) {
		var endpoint = [this.server, path].join("");
		var xhr = new XMLHttpRequest();
		xhr.open(method, endpoint, true);
		if (this.token) {
			xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);
		}
		if (method !== "GET" && this.csrf) {
			xhr.setRequestHeader("X-CSRF-TOKEN", this.csrf);
		}
		return new Promise(
			function(resolve, reject) {
				xhr.onload = function() {
					if (xhr.readyState === 4) {
						if (xhr.status >= 300) {
							const error = {
								status: xhr.status,
								message: xhr.response,
							};
							if (this.onerror) {
								this.onerror(error);
							}
							reject(error);
							return;
						}
						const contentType = xhr.getResponseHeader("Content-Type");
						if (contentType === "application/json") {
							resolve(JSON.parse(xhr.response));
						} else {
							resolve(xhr.response);
						}
					}
				}.bind(this);
				xhr.onerror = e => {
					reject(e);
				};
				if (data) {
					xhr.setRequestHeader("Content-Type", "application/json");
					xhr.send(JSON.stringify(data));
				} else {
					xhr.send();
				}
			}.bind(this),
		);
	}
}

/**
 * Encodes the values into url encoded form sorted by key.
 *
 * @param {object} query parameters in key value object.
 * @return {string} query parameter string
 */
export const encodeQueryString = params => {
	return params
		? Object.keys(params)
				.sort()
				.map(key => {
					const val = params[key];
					return encodeURIComponent(key) + "=" + encodeURIComponent(val);
				})
				.join("&")
		: "";
};
