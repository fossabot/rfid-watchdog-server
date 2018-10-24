var usersTable = $("#usersTable").DataTable({
    "paging": false,
    "ordering": true,
    "info": true,
    "columnDefs": [
        {
            "render": function (data, type, row) {
                var out = "";
                var jdata = JSON.parse(data);
                for (var i = 0; i < jdata.length; i++) {
                    var group = getGroupById(groups,jdata[i]);
                    if(group != undefined){
                        out += group.name;
                        out += ", ";
                    }
                }
                return out.substr(0,out.length-2);
            },
            "targets": 3
        },
        {
            "render": function (data, type, row) {
                return '<button type="button" class="btn btn-warning btn-sm editBtn">Edit</button> <button type="button" class="btn btn-danger btn-sm deleteBtn">Delete</button>';
            },
            "targets": 5
        }
    ]
});

$('#usersTable tbody').on('click', '.editBtn', function () {
    var parent = $(this).parent().parent();
    var data = usersTable.row(parent).data();
    console.log(data);
    $("#editId").val(data[0]);
    $("#editUID").val(data[1]);
    $("#editName").val(data[2]);
    $("#editGroups").val(data[3]);
    $("#editMeta").val(data[4]);
    $("#editUserModal").modal('show');
});

$('#usersTable tbody').on('click', '.deleteBtn', function () {
    var parent = $(this).parent().parent();
    var data = usersTable.row(parent).data();
    console.log(data);
    $("#deleteConfirmSpan").html(data[2] + "(" + data[1] + ")");
    $("#deleteConfirmSpan").attr('data', data[0]);
    $("#deleteConfirmModal").modal('show');
});

var renewUsersList = function (event) {
    var userList = JSON.parse(event.data);
    console.log(userList);
    usersTable.clear();
    userList.forEach(function (data) {
        usersTable.row.add([data.id, data.uid, data.name, data.groups, data.metadata]).draw();
    });
}

var groups = [];


websocket = new WatchdogWebsocket(6085, "/users", {
    onload: function (event) {
        websocket.send("getGroups", "all");
        getUsers();
    },
    usersList: function (event) {
        renewUsersList(event);
    },
    groupsList: function (event) {
        groups = JSON.parse(event.data);
    }
});

function getUsers() {
    websocket.send("getUsers", "all");
}


$("#editUserSave").on('click', function () {
    var editUser = {
        id: $("#editId").val(),
        uid: $("#editUID").val(),
        name: $("#editName").val(),
        metadata: $("#editMeta").val(),
        groups: $("#editGroups").val()
    };
    websocket.send("saveUser", JSON.stringify(editUser));
    $("#editUserModal").modal('hide');
    getUsers();
})

$("#deleteConfirm").on('click', function () {
    var deleteId = $("#deleteConfirmSpan").attr("data");
    websocket.send("deleteUser", deleteId);
    $("#deleteConfirmModal").modal('hide');
    getUsers();
})