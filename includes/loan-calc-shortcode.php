<?php

/**
 * This shortcode allow to create loan calculator. 
 * 
 * @example [chm_loan_calc html_class="branch_search" widget_title="Custom Title" placeholder_amount="500,000"]
 * 
 * @param array $atts Shortcode attributes. @link http://codex.wordpress.org/Shortcode_API#Attributes.
 * 
 * @return string
 */
function chm_loan_calc_shortcode($atts)
{
    extract(
        array_map(
            function ($content) {
                return str_replace(array("&#038;", "&amp;"), "&", $content);
            },
            shortcode_atts(array(
                'html_class'       => '',
                'widget_title' => 'Calculate Your Loan',
                'widget_header' => 'h4',
                'placeholder_amount' => '100,000',
                'placeholder_rate' => '3.319',
                'placeholder_term' => '30'
            ), $atts)
        )
    );

    ob_start();

    // start buffering 
?>

    <form id="loan-calculator" class="calc et_pb_contact <?= $html_class ?>">
        <h4 class="calc-header">Calculate Your Loan</h4>

        <div class="calc-section">
            <ul class="calc-ul list-unstyled">
                <li class="calc-li">
                    <label for="loan-amount">Loan amount</label>
                    <div class="input-group">
                        <input type="text" value="<?= $placeholder_amount ?>" class="form-control number" id="loan-amount" aria-describedby="loan-amount">
                    </div>
                </li>
                <li class="calc-li loan-interest-rate">
                    <label for="loan-interest-rate">Interest Rate</label>
                    <div class="input-group">

                        <input type="number" class="form-control text" id="loan-interest-rate" step=".0001" value="<?= $placeholder_rate ?>" aria-describedby="loan-interest-rate">
                        <div class="input-group-append">
                            <span class="input-group-text" id="loan-interest-rate">%</span>
                        </div>
                    </div>
                </li>
                <li class="calc-li">
                    <label for="loan-years">Loan years</label>
                    <div class="input-group">
                        <input type="number" value="<?= $placeholder_term ?>" max="100" step="1" class="form-control text" id="loan-years" aria-describedby="loan-years">
                    </div>
                </li>
            </ul>
        </div>
        <!-- <div class="calc-section">
            <ul class="calc-ul list-unstyled">
                <li class="calc-li ">
                    <button class="btn btn-primary btn-block ttu" type="submit" id="calculate">Calculate</button>

                </li>
            </ul>
        </div> -->
        <div class="calc-section">
            <ul class="calc-ul list-unstyled">

                <li class="calc-li">
                    <div class="answer-group">
                        <span class="loan-monthly-payment-label" class="">Your Monthly Payment</span>
                        <span id="loan-monthly-payment"></span>
                    </div>
                </li>
            </ul>
        </div>
    </form>

<?php  // print results

    return ob_get_clean();
}

add_shortcode('chm_loan_calc', 'chm_loan_calc_shortcode');
