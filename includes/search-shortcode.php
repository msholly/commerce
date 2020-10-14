<?php

/**
 * This shortcode allow to create click-n-go page selector with Select2 -- jQuery-based replacement for select boxes. 
 * 
 * @link https://github.com/ivaynberg/select2.
 *  * 
 * @example [chm_search html_id="branch_search" html_class="classA classB" ids="10,29,87" query="post_type=gd_place&posts_per_page=-1" meta_query=""]
 * 
 * @param array $atts Shortcode attributes. @link http://codex.wordpress.org/Shortcode_API#Attributes.
 * 
 * @return string
 */
function chm_search_shortcode($atts)
{
    extract(
        array_map(
            function ($content) {
                return str_replace(array("&#038;", "&amp;"), "&", $content);
            },
            shortcode_atts(array(
                'ids'              => '',
                'html_id'          => '',
                'html_class'       => '',
                'tabindex'         => '',
                'query'            => '',
                'meta_query'       => '',
                'placeholder_text' => ''
            ), $atts)
        )
    );

    $list = array_map('trim', explode(',', $ids));

    if ($placeholder_text == '') {
        $placeholder_text = 'Search';
    }

    if ($query !== '') {
        $args = wp_parse_args($query);
        $args['order'] = 'ASC';

        if ($meta_query !== '') {
            $args['meta_query'] = array(wp_parse_args($meta_query));
        }

        $list = array_merge($list, array_map(function ($post) {
            return $post->ID;
        }, get_posts($args)));
    }

    wp_enqueue_script('chm_search', get_stylesheet_directory_uri() . '/includes/scripts/chm-search.js', array(), filemtime(get_stylesheet_directory() . '/assets/js/chm-scripts.js'), true);

    ob_start();

    // start buffering 
?>

    <select id="<?= $html_id ?>" class="chm-select2 <?= $html_class ?>" tabindex="<?= $tabindex ?>">
        <option value=""><?= $placeholder_text ?></option>

        <?php foreach (array_filter(array_unique($list)) as $id) : if ('publish' == get_post_status($id))  ?>

            <option value="<?= get_permalink($id) ?>"><?= get_the_title($id) ?></option>

        <?php endforeach; ?>

    </select>

<?php  // print results

    return ob_get_clean();
}

add_shortcode('chm_search', 'chm_search_shortcode');
