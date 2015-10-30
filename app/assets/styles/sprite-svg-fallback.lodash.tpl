.no-svg {
    .svg-icon {
        background-image: url("<%= backgroundUrl %>");

        <% icons.forEach(function (icon) { %>
        &_type_<%- icon.name %> {
            background-position: <%- -icon.left %>px <%- -icon.top %>px;
            width: <%- icon.width %>px;
            height: <%- icon.height %>px;
        }
        <% }) %>
    }
}


