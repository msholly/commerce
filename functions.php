<?php

add_action('wp_enqueue_scripts', 'theme_enqueue_styles');
function theme_enqueue_styles()
{
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_script('chm-child-scripts', get_stylesheet_directory_uri() . '/assets/js/chm-scripts.js', array('jquery'), filemtime(get_stylesheet_directory() . '/assets/js/chm-scripts.js'), true);
}

// Shortcode for Select2 Search
// require_once 'includes/search-shortcode.php';

// Shortcode for Loan Calculator
require_once 'includes/loan-calc-shortcode.php';

// Geo Directory State Abbreviation change 
require_once 'includes/gd-state-abbrev.php';


//======================================================================
// CUSTOM DASHBOARD
//======================================================================
// ADMIN FOOTER TEXT
function remove_footer_admin()
{
    echo "Commerce Home Mortgage";
}

add_filter('admin_footer_text', 'remove_footer_admin');

// create new column in et_pb_layout screen
add_filter('manage_et_pb_layout_posts_columns', 'ds_create_shortcode_column', 5);
add_action('manage_et_pb_layout_posts_custom_column', 'ds_shortcode_content', 5, 2);
// register new shortcode
add_shortcode('ds_layout_sc', 'ds_shortcode_mod');

// New Admin Column
function ds_create_shortcode_column($columns)
{
    $columns['ds_shortcode_id'] = 'Module Shortcode';
    return $columns;
}

//add support for svg mime type
function cc_mime_types($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

//Disables big image upload warning
add_filter('big_image_size_threshold', '__return_false');

//Display Shortcode
function ds_shortcode_content($column, $id)
{
    if ('ds_shortcode_id' == $column) {
?>
        <p>[ds_layout_sc id="<?php echo $id ?>"]</p>
        <?php
    }
}

// Create New Shortcode
function ds_shortcode_mod($ds_mod_id)
{
    extract(shortcode_atts(array('id' => '*'), $ds_mod_id));
    return do_shortcode('[et_pb_section global_module="' . $id . '"][/et_pb_section]');
}

// Default LO and LO Teams featured image
function dfi_posttype_lo($dfi_id, $post_id)
{
    $post = get_post($post_id);
    if ('gd_loan_officer' === $post->post_type || 'gd_lo_team' === $post->post_type) {
        return 4649; // the image id
    }
    if ('gd_place' === $post->post_type) {
        return 3997; // the image id
    }
    return $dfi_id; // the original featured image id
}
add_filter('dfi_thumbnail_id', 'dfi_posttype_lo', 10, 2);

function _gd_snippet_filed_label_remove_colon( $html, $field_location, $type ) {
	if ( ! empty( $html ) ) {
		$html = str_replace( ': </span>', ' </span>', $html );
	}
	return $html;
}
add_filter( 'geodir_custom_field_output_text', '_gd_snippet_filed_label_remove_colon', 999, 3 ); // 'text' field type

function gd_disable_comment_url($fields) { 
    unset($fields['url']);
    return $fields;
}
add_filter('comment_form_default_fields','gd_disable_comment_url');

add_filter( 'allow_empty_comment', '__return_true' );