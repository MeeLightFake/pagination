<?php

$connection = new mysqli(
    'localhost',
    'meelight',
    '282501mr',
    'printshop'
);

$maxForPage = 2;

function searchProduct($page = 1)
{
    global $connection, $maxForPage;

    # Verify connection
    if ($connection) {
        # max for page
        $maxForPage = 2;
        $offset     = ($page - 1) * $maxForPage;

        # query
        $query = "SELECT * FROM producto
            WHERE status = 1
            ORDER BY `nombre-producto`
            LIMIT $offset, $maxForPage;";

        # result
        $result = mysqli_query($connection, $query);
        $data   = mysqli_fetch_all($result, MYSQLI_ASSOC);

        $json = [
            0 => [
                'id'           => 0,
                'name'         => '',
                'description'  => '',
                'price'        => 0.0,
                'image'        => '',
                'date'         => '',
                'status'       => '',
                'totalPages'   => 0,
            ],
        ];

        for ($i = 0; $i < sizeof($data); $i++) {
            $json[$i]['id']          = $data[$i]['id-producto'];
            $json[$i]['name']        = $data[$i]['nombre-producto'];
            $json[$i]['description'] = $data[$i]['descripcion-producto'];
            $json[$i]['price']       = $data[$i]['precio-producto'];
            $json[$i]['image']       = $data[$i]['imagen-producto'];
            $json[$i]['date']        = $data[$i]['fecha-creacion-producto'];
            $json[$i]['status']      = $data[$i]['status'];
        }

        # query 2
        $query = "SELECT COUNT(*) AS cantidad
            FROM producto
            WHERE status = 1;";

        # result 2
        $result             = mysqli_query($connection, $query);
        $pages              = mysqli_fetch_assoc($result);
        $totalPages         = ceil($pages['cantidad'] / $maxForPage);
        $json['totalPages'] = $totalPages;

        # encoding
        $jsonString = json_encode($json);
        return $jsonString;
    }
}
