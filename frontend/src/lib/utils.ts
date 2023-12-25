export function removeUrlParam(param: string) {
	const url = new URL(window.location.href);
	url.searchParams.delete(param);
	window.history.replaceState({}, "", url.toString());
}
