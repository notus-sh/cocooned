/* eslint no-unused-vars: 0, max-len: 0 */

var templates = {
  'basic': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="cocooned-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
    
        <div class="links">
          <a  class="cocooned-add"
              href="#"
              data-association="item"
              data-associations="items"
              data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
              
              &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
              &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
              
              &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
              &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
            &lt;/div&gt;">Add</a>
        </div>
      </div>
    </form>`,

  'remove-links-wrapper-class': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form" data-nested-model="items">
        <div class="nested-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" data-wrapper-class="nested-item" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
        
        <div class="links">
          <a  class="cocooned-add"
              href="#"
              data-association="item"
              data-associations="items"
              data-association-insertion-template="&lt;div class=&quot;nested-item&quot;&gt;
              
              &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
              &lt;a class=&quot;cocooned-remove dynamic&quot; data-wrapper-class=&quot;nested-item&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
              
              &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
              &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
            &lt;/div&gt;">Add</a>
        </div>
      </div>
    </form>`,

  'add-links-association-insertion-method': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="cocooned-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
    
        <div class="links">
          <a  class="cocooned-add"
              href="#"
              data-association="item"
              data-associations="items"
              data-association-insertion-method="after"
              data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
              
              &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
              &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
              
              &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
              &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
            &lt;/div&gt;">Add</a>
        </div>
      </div>
    </form>`,

  'add-links-association-insertion-node': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="cocooned-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
        
        <div class="insertion-node"></div>
      </div>
        
      <a  class="cocooned-add"
          href="#"
          data-association="item"
          data-associations="items"
          data-association-insertion-node=".insertion-node"
          data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
          
          &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
          &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
          
          &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
          &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
        &lt;/div&gt;">Add</a>
    </form>`,

  'add-links-association-insertion-traversal': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="cocooned-item">
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
        
        <div class="insertion-node"></div>
        
        <a  class="cocooned-add"
            href="#"
            data-association="item"
            data-associations="items"
            data-association-insertion-node=".insertion-node"
            data-association-insertion-traversal="siblings"
            data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
            
            &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
            &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
            
            &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
            &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
          &lt;/div&gt;">Add</a>
      </div>
    </form>`,

  'add-links-count': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="cocooned-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
    
        <div class="links">
          <a  class="cocooned-add"
              href="#"
              data-association="item"
              data-associations="items"
              data-count="2"
              data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
              
              &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
              &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
              
              &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
              &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
            &lt;/div&gt;">Add</a>
        </div>
      </div>
    </form>`,

  'add-links-limit-basic': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="cocooned-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
    
        <div class="links">
          <a  class="cocooned-add"
              href="#"
              data-association="item"
              data-associations="items"
              data-limit="2"
              data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
              
              &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
              &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
              
              &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
              &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
            &lt;/div&gt;">Add</a>
        </div>
      </div>
    </form>`,

  'add-links-limit-valid': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="cocooned-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
      </div>
      
      <a  class="cocooned-add"
          href="#"
          data-association="item"
          data-associations="items"
          data-limit="2"
          data-association-insertion-node=".nested-form"
          data-association-insertion-method="append"
          data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
          
          &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
          &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
          
          &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
          &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
          &lt;input type=&quot;hidden&quot; value=&quot;0&quot; name=&quot;list[items_attributes][new_items][position]&quot; id=&quot;list_items_attributes_new_items_position&quot; /&gt;
        &lt;/div&gt;">Add</a>
    </form>`,

  'reorderable': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form" data-cocooned-options="{ 'reorderable': true }">
        <div class="cocooned-item">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          <a class="cocooned-move-up" href="#">Move up</a>
          <a class="cocooned-move-down" href="#">Move down</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
          <input type="hidden" value="1" name="list[items_attributes][1][position]" id="list_items_attributes_1_position" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
      </div>
        
      <a  class="cocooned-add"
          href="#"
          data-association="item"
          data-associations="items"
          data-association-insertion-node=".nested-form"
          data-association-insertion-method="append"
          data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;
          
          &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
          &lt;a class=&quot;cocooned-remove dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
          &lt;a class=&quot;cocooned-move-up&quot; href=&quot;#&quot;&gt;Move up&lt;/a&gt;
          &lt;a class=&quot;cocooned-move-down&quot; href=&quot;#&quot;&gt;Move down&lt;/a&gt;
          
          &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
          &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
          &lt;input type=&quot;hidden&quot; value=&quot;0&quot; name=&quot;list[items_attributes][new_items][position]&quot; id=&quot;list_items_attributes_new_items_position&quot; /&gt;
        &lt;/div&gt;">Add</a>
    </form>`,

  'compatibility': `
    <form id="form-template" novalidate="novalidate" action="" accept-charset="UTF-8" method="post">
  
      <div class="nested-form">
        <div class="nested-fields">
        
          <input type="hidden" name="list[items_attributes][1][_destroy]" id="list_items_attributes_1__destroy" value="false" />
          <a class="remove_fields existing" href="#">Remove</a>
          
          <label for="list_items_attributes_1_label">Label</label>
          <input type="text" name="list[items_attributes][1][label]" id="list_items_attributes_1_label" />
        </div>
        <input type="hidden" value="1" name="list[items_attributes][1][id]" id="list_items_attributes_1_id" />
      </div>
        
      <a  class="add_fields"
          href="#"
          data-association="item"
          data-associations="items"
          data-association-insertion-node=".nested-form"
          data-association-insertion-method="append"
          data-association-insertion-template="&lt;div class=&quot;nested-fields&quot;&gt;
          
          &lt;input type=&quot;hidden&quot; name=&quot;list[items_attributes][new_items][_destroy]&quot; id=&quot;list_items_attributes_new_items__destroy&quot; value=&quot;false&quot; /&gt;
          &lt;a class=&quot;remove_fields dynamic&quot; href=&quot;#&quot;&gt;Remove&lt;/a&gt;
          
          &lt;label for=&quot;list_items_attributes_new_items_label&quot;&gt;Label&lt;/label&gt;
          &lt;input type=&quot;text&quot; name=&quot;list[items_attributes][new_items][label]&quot; id=&quot;list_items_attributes_new_items_label&quot; /&gt;
        &lt;/div&gt;">Add</a>
    </form>`
};
