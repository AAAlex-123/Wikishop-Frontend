let load = {}

load.cart = (contentElementId) => {

	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get('username');
	const sess = searchParams.get('sessionId');
	cartRetrievalService(username, sess);

}
