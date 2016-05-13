<?php
// Update JSON cache for the endpoints - because standard WP REST API is too slow for realtime. 


function reactionary_updateCache() {
	$options = get_option( 'reactionary__settings' );
	$base_url = site_url() . '/wp-json/wp/v2/';
	$endpoints[] = $base_url . $options['reactionary__menu_endpoint'];
	$endpoints[] = $base_url . $options['reactionary__primary_endpoint'];
	$endpoints[] = $base_url . $options['reactionary__secondary_endpoint'];

	foreach ($endpoints as $key => $endpoint) {
		$jsonSources[] = file_get_contents($endpoint);
	}

	$titles[] = $options['reactionary__primary_title'];
	$titles[] = $options['reactionary__secondary_title'];
	$titles = json_encode($titles);

	// Write json data to targets (local files)
	file_put_contents(get_stylesheet_directory() . '/assets/content/menu.json', $jsonSources[0]);
	file_put_contents(get_stylesheet_directory() . '/assets/content/primary.json', $jsonSources[1]);
	file_put_contents(get_stylesheet_directory() . '/assets/content/secondary.json', $jsonSources[2]);
	file_put_contents(get_stylesheet_directory() . '/assets/content/titles.json', $titles);

};

add_action('save_post', 'reactionary_updateCache');


