$(document).ready(function () {
    $.widget.bridge('uibutton', $.ui.button);

    const $btnClearSearch = $('#btn-clear-search');
    const $btnSearch = $('#btn-search');
    const $inputSearch = $(`input[name="search_value"]`);
    // Active Menu
    activeMenu();

    // Search event
    $btnSearch.click(function(e) {
        const search_value = $inputSearch.val();
        let pathname = window.location.pathname;

        if (search_value) {
            pathname += '?search_value=' + search_value;
        } else {
            
        }
        window.location.replace(pathname);
    });

    $btnClearSearch.click(function() {
        $inputSearch.val('');
        $btnSearch.click();
    });

    // $inputSearch.on('keyup', function(event) {
    //     if (event.key)
    // });

});

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 5000,
    padding: '1rem',
});

function activeMenu() {
    let searchParams = new URLSearchParams(window.location.search);
    let controller = searchParams.get('controller');
    let action = searchParams.get('action');

    let $currentMenuItemLevel1 = $('.nav-sidebar > .nav-item > [data-active="' + controller + '"]');
    $currentMenuItemLevel1.addClass('active');

    let $navTreeview = $currentMenuItemLevel1.next();
    if ($navTreeview.length > 0) {
        let $currentMenuItemLevel2 = $navTreeview.find('[data-active="' + action + '"]');
        $currentMenuItemLevel2.addClass('active');
        $currentMenuItemLevel1.parent().addClass('menu-open');
    } else {
        $('.nav-sidebar > .nav-item > [data-active="' + action + '"]').addClass('active');
    }
}

function swalConfig(text, icon, confirmText) {
    return {
        position: 'top',
        title: 'Thông báo!',
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        cancelButtonText: 'Hủy',
    };
}

function deleteItem(linkDelete) {
    Swal.fire(swalConfig('Bạn có muốn xóa dữ liệu này?', 'error', 'Xóa')).then(
        (result) => {
            if (result.value) {
                window.location.href = linkDelete;
            };
        }
    );
}

function sortList(field, order) {
    // http://php01.test/mvc-multi/index.php?module=admin&controller=group&action=index&filter_status=active&search=a&sort_field=name&sort_order=desc
    $('input[name="sort_field"]').val(field);
    $('input[name="sort_order"]').val(order);

    let exceptParams = ['page', 'sort_field', 'sort_order'];
    let link = createLink(exceptParams);

    link += `sort_field=${field}&sort_order=${order}`;
    window.location.href = link;

    // $('#form-table').submit();
}

function submitForm(link) {
    $('#admin-form').attr('action', link);
    $('#admin-form').submit();
}

function createLink(exceptParams) {
    let pathname = window.location.pathname;
    let searchParams = new URLSearchParams(window.location.search);
    let searchParamsEntries = searchParams.entries();

    let link = pathname + '?';
    for (let pair of searchParamsEntries) {
        if (exceptParams.indexOf(pair[0]) == -1) {
            link += `${pair[0]}=${pair[1]}&`;
        }
    }
    return link;
}

function showToast(type, action) {
    let message = '';
    switch (action) {
        case 'update':
            message = 'Cập nhật thành công!';
            break;
        case 'bulk-action-not-selected-action':
            message = 'Vui lòng chọn action cần thực hiện!';
            break;
        case 'bulk-action-not-selected-row':
            message = 'Vui lòng chọn ít nhất 1 dòng dữ liệu!';
            break;
    }

    Toast.fire({
        icon: type,
        title: ' ' + message,
    });
}

function filePreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#admin-preview-image').css('display', 'block');
            $('#admin-preview-image').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function showSelectedRowInBulkAction() {
    let checkbox = $('#form-table input[name="checkbox[]"]:checked');
    let navbarBadge = $('#bulk-apply .navbar-badge');
    if (checkbox.length > 0) {
        navbarBadge.html(checkbox.length);
        navbarBadge.css('display', 'inline');
    } else {
        navbarBadge.html('');
        navbarBadge.css('display', 'none');
    }
}
