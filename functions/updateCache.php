<?php
// Update JSON cache for the endpoints - because standard WP REST API is too slow for realtime. 


function reactionary_updateCache() {
	$options = get_option( 'reactionary__settings' );
	$base_url = site_url() . '/wp-json/wp/v2/';
	$endpoints[] = $base_url . $options['reactionary__menu_endpoint'];
	$endpoints[] = $base_url . $options['reactionary__primary_endpoint'];
	$endpoints[] = $base_url . $options['reactionary__secondary_endpoint'];

	foreach ($endpoints as $key => $endpoint) {
		$jsonSources[] = json_decode(file_get_contents($endpoint));
	}

	$sizes = get_intermediate_image_sizes();

	for ($i = 0; $i < sizeof($jsonSources) - 1; $i++) {
		foreach($jsonSources[$i] as $index => $post) {
			if ($post->featured_media) {
				foreach ($sizes as $key => $size) {
					$image_urls[$size] = wp_get_attachment_image_src( $post->featured_media, $size )[0];					
				}
				$jsonSources[$i][$index]->image_urls = $image_urls;
			}
		}
	}

//	var_dump($jsonSources[1][1]);

	$rest['menu']['title'] = get_bloginfo('name');
	$rest['menu']['posts'] = $jsonSources[0];
	
	$rest['primary']['title'] = $options['reactionary__primary_title'];
	$rest['primary']['posts'] = $jsonSources[1];

	$rest['secondary']['title'] = $options['reactionary__secondary_title'];
	$rest['secondary']['posts'] = $jsonSources[2];

//	var_dump($rest['primary']['posts']);

//	$titles[] = $options['reactionary__primary_title'];
//	$titles[] = $options['reactionary__secondary_title'];
	$rest = json_encode($rest);

	// Write json data to targets (local files)
//	file_put_contents(get_stylesheet_directory() . '/assets/content/menu.json', $jsonSources[0]);
//	file_put_contents(get_stylesheet_directory() . '/assets/content/primary.json', $jsonSources[1]);
//	file_put_contents(get_stylesheet_directory() . '/assets/content/secondary.json', $jsonSources[2]);
//	file_put_contents(get_stylesheet_directory() . '/assets/content/titles.json', $titles);
	file_put_contents(get_stylesheet_directory() . '/assets/content/posts.json', $rest);

};

add_action('save_post', 'reactionary_updateCache');


