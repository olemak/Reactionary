<?php
add_action( 'admin_menu', 'reactionary__add_admin_menu' );
add_action( 'admin_init', 'reactionary__settings_init' );


function reactionary__add_admin_menu(  ) { 

	add_menu_page( 'Reactionary', 'Reactionary', 'manage_options', 'reactionary', 'reactionary__options_page' );

}


function reactionary__settings_init(  ) { 

	register_setting( 'pluginPage', 'reactionary__settings' );

	add_settings_section(
		'reactionary__pluginPage_section', 
		__( 'Reactionary requires WP REST API v2.', 'reactionary' ), 
		'reactionary__settings_section_callback', 
		'pluginPage'
	);

	add_settings_field( 
		'reactionary__menu_endpoint', 
		__( 'Menu endpoint', 'reactionary' ), 
		'reactionary__menu_endpoint_render', 
		'pluginPage', 
		'reactionary__pluginPage_section' 
	);

	add_settings_field( 
		'reactionary__primary_title', 
		__( 'Primary posts: Title', 'reactionary' ), 
		'reactionary__primary_title_render', 
		'pluginPage', 
		'reactionary__pluginPage_section' 
	);

	add_settings_field( 
		'reactionary__primary_endpoint', 
		__( 'Primary posts: Endpoint', 'reactionary' ), 
		'reactionary__primary_endpoint_render', 
		'pluginPage', 
		'reactionary__pluginPage_section' 
	);

	add_settings_field( 
		'reactionary__secondary_title', 
		__( 'Secondary posts: Title', 'reactionary' ), 
		'reactionary__secondary_title_render', 
		'pluginPage', 
		'reactionary__pluginPage_section' 
	);

	add_settings_field( 
		'reactionary__secondary_endpoint', 
		__( 'Secondary posts: Endpoint', 'reactionary' ), 
		'reactionary__secondary_endpoint_render', 
		'pluginPage', 
		'reactionary__pluginPage_section' 
	);


}


function reactionary__menu_endpoint_render(  ) { 

	$options = get_option( 'reactionary__settings' );
	?>
	<legend class="endpoint-legend" style="float:left;font-size:18px;margin-top:4px;"><?php echo site_url(); ?>/wp-json/wp/v2/</legend>
	<input style="border: none;border-bottom: 1px solid grey;background-color: transparent;box-shadow: none;font-size: 18px;color: blue;"
		type='text' name='reactionary__settings[reactionary__menu_endpoint]' size="60" value='<?php echo ($options['reactionary__menu_endpoint'] ? $options['reactionary__menu_endpoint'] : 'pages'); ?>'>
	<?php

}


function reactionary__primary_title_render(  ) { 

	$options = get_option( 'reactionary__settings' );
	?>
	<input style="font-size:18px;font-weight:600;" type='text' name='reactionary__settings[reactionary__primary_title]' value='<?php echo ($options['reactionary__primary_title'] ? $options['reactionary__primary_title'] : 'Blog'); ?>'>
	<?php

}


function reactionary__primary_endpoint_render(  ) { 

	$options = get_option( 'reactionary__settings' );
	?>
	<legend class="endpoint-legend" style="float:left;font-size:18px;margin-top:4px;"><?php echo site_url(); ?>/wp-json/wp/v2/</legend>
	<input style="border: none;border-bottom: 1px solid grey;background-color: transparent;box-shadow: none;font-size: 18px;color: blue;"
	type='text' name='reactionary__settings[reactionary__primary_endpoint]' size="60" value='<?php echo ($options['reactionary__primary_endpoint'] ? $options['reactionary__primary_endpoint'] : 'posts'); ?>'>
	<?php

}


function reactionary__secondary_title_render(  ) { 

	$options = get_option( 'reactionary__settings' );
	?>
	<input style="font-size:18px;font-weight:600;" type='text' name='reactionary__settings[reactionary__secondary_title]' value='<?php echo ($options['reactionary__secondary_title'] ? $options['reactionary__secondary_title'] : 'Projects'); ?>'>
	<?php

}


function reactionary__secondary_endpoint_render(  ) { 

	$options = get_option( 'reactionary__settings' );
	?>
	<legend class="endpoint-legend" style="float:left;font-size:18px;margin-top:4px;"><?php echo site_url(); ?>/wp-json/wp/v2/</legend>
	<input style="border: none;border-bottom: 1px solid grey;background-color: transparent;box-shadow: none;font-size: 18px;color: blue;"
	type='text' name='reactionary__settings[reactionary__secondary_endpoint]' size="60" value='<?php echo ($options['reactionary__secondary_endpoint'] ? $options['reactionary__secondary_endpoint'] : 'posts'); ?>'>
	<?php

}


function reactionary__settings_section_callback(  ) { 

	echo __( '<p>At the time of writing, WP REST API v2 is still in beta, so it is not part of WP Core and must be installed as a plugin and enabled.<br>Please refer to the WP REST API plugin documentation for details on installation and configuration of endpoints.</p><p>Reactionary only allows three sets of posts to be fetched - a set of posts or pages to display in the top menu, a primary set of posts (default: last uncathegorized blog posts) and a secondary set of posts (default: same as the primary dataset.<br>Use the WP REST API to compose your endpoints, or just go with the defaults below to get started.<br>Currently, there\'s no way to disable a section/endpoint: unless you enter your own values, the defaults will be used. This might be changed if the people demands an option to disable sections.</p>)', 'reactionary' );

}


function reactionary__options_page(  ) { 

	?>
	<form action='options.php' method='post'>

		<h2>Reactionary</h2>

		<?php
		settings_fields( 'pluginPage' );
		do_settings_sections( 'pluginPage' );
		submit_button();
		?>

	</form>
	<?php

}

?>