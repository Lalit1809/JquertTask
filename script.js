
$(document).ready(function () {
    let headingCount = 0;
    let allData = JSON.parse(localStorage.getItem('formData')) || [];

    // Retrieve data from localStorage on page load
    if (allData.length > 0) {
        allData.forEach((headingObj) => {
            headingCount++;
            const headingID = 'heading-' + headingCount;

            $("#resultDiv").append(`
                <div class="heading-block" id="${headingID}">
                    <h2>${headingObj.heading} <button class="delete-heading btn btn-close " data-id="${headingID}">❌</button></h2>
                    <div class="subheading-container">
                        ${headingObj.subheadings.map(sub => `
                            <h4>${sub.subheading} <button class="delete-subheading btn btn-close" data-sub="${sub.subheading}">❌</button></h4>
                            <div class="formInput">
                                ${sub.inputs.join('<br>')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);

            // Update dropdowns
            $("#myDropdown, #selectDown").append(`<option value="${headingID}">${headingObj.heading}</option>`);
            headingObj.id = headingID; // Ensure ID stays consistent
        });
    }

    //  HEADING SAVE BUTTON
    $("#saveButton").click(function () {
        $("#exampleModal").modal('hide');
        var inputValue = $("#headInput").val().trim();

        if (inputValue !== '') {
            headingCount++;
            var headingID = 'heading-' + headingCount;

            var headingBlock = $("#resultDiv").append(`<div class="heading-block" id="${headingID}">
                    <h2>${inputValue} <button class="delete-heading btn btn-close " data-id="${headingID}">❌</button></h2>
                    <div class="subheading-container"></div>   
                </div>
            `);
            $("hr").after(headingBlock);

            $("#myDropdown, #selectDown").append(`<option value="${headingID}">${inputValue}</option>`);
            $("#headInput").val('');

            //  Save to localStorage
            allData.push({
                heading: inputValue,
                id: headingID,
                subheadings: []
            });
            localStorage.setItem('formData', JSON.stringify(allData));
        }
        enableSubheadingDragDrop();


    });
    //remove heading
    $(document).on('click', '.delete-heading', function () {
        var headingID = $(this).data('id');


        $('#' + headingID).remove();


        allData = allData.filter(h => h.id !== headingID);
        localStorage.setItem('formData', JSON.stringify(allData));

        $(`#selectDown option[value="${headingID}"]`).remove();
        $(`#myDropdown option[value="${headingID}"]`).remove();
    });

    //  SUB-HEADING SAVE BUTTON
    $("#subhsaveButton").click(function () {
        $("#exampleModal-1").modal('hide');
        var selectedHeadingId = $("#myDropdown").val();
        var subInputValue = $("#subheadInput1").val().trim();

        if (selectedHeadingId && subInputValue !== '') {
            $('#' + selectedHeadingId + ' .subheading-container').append(`
                <h4>${subInputValue} <button class="delete-subheading btn btn-close" data-sub="${subInputValue}">❌</button></h4>
                <div class="formInput"></div>`);

            $("#subheadInput1").val('');

            //  Update localStorage
            let headingObj = allData.find(obj => obj.id === selectedHeadingId);
            if (headingObj) {
                headingObj.subheadings.push({
                    subheading: subInputValue,
                    inputs: []
                });
                localStorage.setItem('formData', JSON.stringify(allData));
            }
        }
        enableSubheadingDragDrop();

    });
    //remove sub-heading
    $(document).on('click', '.delete-subheading', function () {
        var subheading = $(this).data('sub');
        var parentHeading = $(this).closest('.heading-block').attr('id');


        $(this).closest('h4').next('.formInput').remove();
        $(this).closest('h4').remove();

        let headObj = allData.find(h => h.id === parentHeading);
        if (headObj) {
            headObj.subheadings = headObj.subheadings.filter(s => s.subheading !== subheading);
            localStorage.setItem('formData', JSON.stringify(allData));
        }
        $('#selectDown1 option').each(function () {
            if ($(this).val() === subheading) {
                $(this).remove();
            }
        });
    });

    // form section
    //  Subheading dropdown on heading change
    $("#selectDown").change(function () {
        var formheadingID = $("#selectDown").val();
        var formSubheading = $("#" + formheadingID + " .subheading-container h4");


        $("#selectDown1").empty();

        if (formSubheading.length > 0) {
            var topSubHead = formSubheading.first().clone().children().remove().end().text().trim();
            console.log(topSubHead, 'This is sub-heading');
            $("#selectDown1").append(`<option value="${topSubHead}">${topSubHead}</option>`);

            formSubheading.slice(1).each(function () {
                var subText = $(this).clone().children().remove().end().text().trim();

                $("#selectDown1").append(`<option value="${subText}">${subText}</option>`);
            });
        }
    });

    //  FORM SAVE BUTTON
    $("#formsaveButton").click(function () {
        $("#exampleModal-2").modal('hide');

        var formheadID = $("#selectDown").val();
        var formsubheadtext = $("#selectDown1").val();
        var inputType = $("#selectDown2").val();
        var nameIn = $("#nameInput").val();
        var lableIn = $("#lableInput").val();
        var classIn = $("#classInput").val();
        var placeholderIn = $("#placeholderInput").val();
        var valueIn = $("#valueInput").val();
        var optionIn = $("#optionInput").val();
        var readIn = $("#readonlyBox").prop("checked") ? 'readonly' : '';
        var disIn = $("#disabledBox").prop("checked") ? 'disabled' : '';
        var reqIn = $("#requiredBox").prop("checked") ? 'required' : '';

        let formHTML = "";

        if (inputType === "text" || inputType === "email" || inputType === "password" || inputType === "number" ||
            inputType === "tel" || inputType === "search" || inputType === "url" || inputType === "date" ||
            inputType === "time" || inputType === "week" || inputType === "month" || inputType === "color" ||
            inputType === "hidden") {

            formHTML = `
            <label>${lableIn}</label> <br>
            <input type="${inputType}" 
                   name="${nameIn}" 
                   class="${classIn}" 
                   placeholder="${placeholderIn}" 
                   value="${valueIn}" 
                   ${readIn} ${disIn} ${reqIn} />
        `;

        } else if (inputType === "textarea") {
            formHTML = `
            <label>${lableIn}</label> <br>
            <textarea name="${nameIn}" 
                      class="${classIn}" 
                      placeholder="${placeholderIn}" 
                      ${readIn} ${disIn} ${reqIn}>${valueIn}</textarea>
        `;

        } else if (inputType === "select") {
            formHTML = `
            <label>${lableIn}</label> <br>
            <select name="${nameIn}" 
                    class="${classIn}" 
                    ${readIn} ${disIn} ${reqIn}>
                ${optionIn.split(',').map(opt => `<option>${opt.trim()}</option>`).join('')}


            </select>
        `;

        } else if (inputType === "checkbox" || inputType === "radio") {
            formHTML = `
            ${optionIn.split(',').map(opt => `
            <label>
            ${opt.trim()}
                <input type="${inputType}" 
                       name="${nameIn}" 
                       class="${classIn}"
                       ${readIn} ${disIn} ${reqIn}>
               
            </label>
        `).join('')}`;

        } else if (inputType === "file" || inputType === "image") {
            formHTML = `
            <label>${lableIn}</label> <br>
            <input type="${inputType}" 
                   name="${nameIn}" 
                   class="${classIn}" 
                   ${readIn} ${disIn} ${reqIn} />
        `;

        } else if (inputType === "button" || inputType === "submit" || inputType === "reset") {
            formHTML = `
            <button type="${inputType}" 
                    class="${classIn}" 
                    ${disIn}>${valueIn}</button> <br>
        `;

        } else {
            formHTML = `<p>Invalid input type selected</p>`;
        }
        $("#" + formheadID + " .subheading-container h4").each(function () {
            if ($(this).clone().children().remove().end().text().trim() === formsubheadtext) {
                $(this).next(".formInput").append(`${formHTML} <br>`);
            }
        });

        //  Update localStorage
        let headData = allData.find(h => h.id === formheadID);
        if (headData) {
            let subData = headData.subheadings.find(s => s.subheading === formsubheadtext);
            if (subData) {
                subData.inputs.push(formHTML);
                localStorage.setItem('formData', JSON.stringify(allData));
            }
        }

        // Clear all fields
        $("#selectDown,#selectDown1,#selectDown2,#nameInput, #lableInput, #classInput, #placeholderInput, #valueInput, #optionInput").val('');
        $("#readonlyBox, #disabledBox, #requiredBox").prop("checked", false);
    });
// for heading Drag and Drop
    $("#resultDiv").sortable({
        items: '.heading-block',
        handle: 'h2',
        update: function () {
            const newOrder = [];
            $('#resultDiv .heading-block').each(function () {
                const id = $(this).attr('id');
                const data = allData.find(h => h.id === id);
                if (data) newOrder.push(data);
            });
            allData = newOrder;
            localStorage.setItem('formData', JSON.stringify(allData));
        }
    });

    // for subheadings Drag and Drop
    function enableSubheadingDragDrop() {
        $(".subheading-container").sortable({
            connectWith: ".subheading-container",
            items: "h4",
            // placeholder: "ui-state-highlight",
            // helper: "clone",
            start: function (event, ui) {
                const $formInput = ui.item.next(".formInput");
                const $headingBlock = ui.item.closest(".heading-block").attr("id");
                ui.item.data("formInputEl", $formInput);
                ui.item.data("oldHeading", $headingBlock);
                $formInput.hide(); // hide temporarily
            },
            stop: function (event, ui) {
                const $formInput = ui.item.data("formInputEl");
                const movedSubText = ui.item.clone().children().remove().end().text().trim();

                const $oldHeading = ui.item.data("oldHeading");
                const $newHeading = ui.item.closest(".heading-block");
                const newHeadingId = $newHeading.attr("id");

                // Re-insert formInput after the moved h4
                if ($formInput && $formInput.length) {
                    ui.item.after($formInput);
                    $formInput.show();
                }

                // Remove subheading from old heading
                let movedSub = null;
                const oldHeadObj = allData.find(h => h.id === $oldHeading);
                if (oldHeadObj) {
                    const index = oldHeadObj.subheadings.findIndex(s => s.subheading === movedSubText);
                    if (index !== -1) {
                        movedSub = oldHeadObj.subheadings.splice(index, 1)[0];
                    }
                }

                // Add subheading to new heading
                if (movedSub) {
                    const newHeadObj = allData.find(h => h.id === newHeadingId);
                    if (newHeadObj) {
                        newHeadObj.subheadings.push(movedSub);
                    }
                }

                // Save updated structure
                localStorage.setItem("formData", JSON.stringify(allData));
            }
        });
    }

    enableSubheadingDragDrop();




});

