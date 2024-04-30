<h2>Motivation</h2>
<p>https://jsonplaceholder.typicode.com/ is great to experiment with http : GET , POST , DELETE , PUT and PATCH but it does not mutate its data and this confusing</p>


<h2>Introduction</h2>
<p>This project implement the api side of https://jsonplaceholder.typicode.com + persitence on files</p>

<h2>Points of interest</h2>
<ul>
<li>by removing the data directory you actually clear the storage. Next time the server start it will look for data directory and if missing will create data directory with all info from https://jsonplaceholder.typicode.com</li>
<li>You can test the api according to the test directory. Currently i have post.http which can be used to send http request to the posts endpoint (but the server must be running)</li>
</ul>