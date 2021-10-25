<script>
	let files, input;
	let tags = "";
	let uploadedMemes = [];

	function uploadMeme() {
		const formData = new FormData();
		formData.append("meme", files[0]);
		formData.append("tags", tags);
		fetch("/api/upload-meme", {
			method: "POST",
			body: formData,
		})
			.then((response) => {
				input.value = "";
				tags = "";
				return response.json();
			})
			.then((result) => {
				loadMemes();
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	function loadMemes() {
		fetch(new Request("/api/memes"))
			.then(function (response) {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(function (response) {
				uploadedMemes = response;
			});
	}
	document.addEventListener("DOMContentLoaded", loadMemes, false);
</script>

<main>
	<h1>Meme Inspector</h1>
	<div class="upload-box">
		<input id="fileUpload" type="file" bind:files bind:this={input} />

		<label for="tags">Tags:</label>
		<input type="text" id="tags" name="tags" bind:value={tags} /><br /><br
		/>
		{#if files && files[0]}
			<button on:click={uploadMeme}>Submit</button>
		{:else}
			<button disabled>Submit</button>
		{/if}
	</div>

	{#if uploadedMemes.length > 0}
		<table>
			<tr>
				<th>Meme name</th>
				<th>Tags</th>
				<th>Size</th>
				<th>Mimetype</th>
				<th>Uploaded at</th>
			</tr>
			{#each uploadedMemes as meme}
				<tr>
					<td>
						<a href="https://meme-inspector-bucket.s3.eu-central-1.amazonaws.com/{meme.id}.{meme.file_extension}">{meme.name}</a>
					</td>
					<td>
						{meme.tags}
					</td>
					<td>
						{Math.round(meme.size / 1024 / 102.4) / 10} MB
					</td>
					<td>
						{meme.mimetype}
					</td>
					<td>
						{new Date(meme.upload_date).toUTCString()}
					</td>
				</tr>
			{/each}
		</table>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 3em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	table {
		text-align: left;
	}

	td,
	th {
		padding-right: 1em;
	}

	.upload-box {
		text-align: left;
		margin-top: 1em;
		margin-bottom: 3em;
	}

	#fileUpload {
		margin-bottom: 1em;
	}
</style>
