# Script para generar iconos PWA de Lynx con System.Drawing (.NET)
Add-Type -AssemblyName System.Drawing

function Create-LynxIcon {
    param (
        [int]$Size,
        [string]$OutPath,
        [bool]$IsMaskable = $false
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Fondo degradado
    $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(124, 58, 237), # #7C3AED
        [System.Drawing.Color]::FromArgb(76, 29, 149),  # #4C1D95
        45.0
    )

    if ($IsMaskable) {
        $g.FillRectangle($brush, $rect)
    } else {
        # Esquinas redondeadas estilo app icon (22% de curvatura)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $radius = [int]($Size * 0.22)
        $diameter = $radius * 2
        $arc = New-Object System.Drawing.Rectangle 0, 0, $diameter, $diameter
        $path.AddArc($arc, 180, 90)
        $arc.X = $Size - $diameter
        $path.AddArc($arc, 270, 90)
        $arc.Y = $Size - $diameter
        $path.AddArc($arc, 0, 90)
        $arc.X = 0
        $path.AddArc($arc, 90, 90)
        $path.CloseFigure()
        $g.FillPath($brush, $path)
        $path.Dispose()
    }
    $brush.Dispose()

    # Dimensiones y escala del Lince (viewBox original 300x360)
    $targetH = if ($IsMaskable) { $Size * 0.58 } else { $Size * 0.68 }
    $scale = $targetH / 360.0
    $targetW = 300.0 * $scale
    $offsetX = ($Size - $targetW) / 2.0
    $offsetY = ($Size - $targetH) / 2.0 - ($Size * 0.02)

    # Coordenadas poligonales del Lince oficial de Lynx
    $lynxPolygons = @(
        # 1. Oreja izquierda y borde exterior
        @( @(38,32), @(122,138), @(84,152), @(60,94), @(62,186), @(56,198), @(80,162), @(38,32) ),
        # 2. Mechón oreja izquierda
        @( @(116,116), @(108,140), @(76,96), @(116,116) ),
        # 3. Oreja derecha y borde exterior
        @( @(262,32), @(178,138), @(216,152), @(240,94), @(238,186), @(244,198), @(220,162), @(262,32) ),
        # 4. Mechón oreja derecha
        @( @(184,116), @(192,140), @(224,96), @(184,116) ),
        # 5. Mechón frente izquierda
        @( @(115,160), @(108,184), @(134,228), @(130,196) ),
        # 6. Mechón frente derecha
        @( @(185,160), @(192,184), @(166,228), @(170,196) ),
        # 7. Ojo izquierdo
        @( @(79,190), @(126,215), @(129,232), @(98,226) ),
        # 8. Ojo derecho
        @( @(221,190), @(174,215), @(171,232), @(202,226) ),
        # 9. Mejilla izquierda
        @( @(78,214), @(62,250), @(77,248), @(105,292), @(75,258) ),
        # 10. Mejilla derecha
        @( @(222,214), @(238,250), @(223,248), @(195,292), @(225,258) ),
        # 11. Hocico / Boca felina
        @( @(136,248), @(164,248), @(153,273), @(153,282), @(172,290), @(150,286), @(128,290), @(147,282), @(147,273), @(136,248) )
    )

    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    foreach ($poly in $lynxPolygons) {
        $pts = New-Object "System.Drawing.PointF[]" $poly.Count
        for ($i = 0; $i -lt $poly.Count; $i++) {
            $px = $offsetX + ($poly[$i][0] * $scale)
            $py = $offsetY + ($poly[$i][1] * $scale)
            $pts[$i] = New-Object System.Drawing.PointF($px, $py)
        }
        $g.FillPolygon($whiteBrush, $pts)
    }
    $whiteBrush.Dispose()

    # Si es tamaño grande y no maskable, texto LYNX discreto abajo
    if (!$IsMaskable -and $Size -ge 512) {
        $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
        $fontSize = [float]($Size * 0.075)
        $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold)
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(237, 233, 254))
        $stringFormat = New-Object System.Drawing.StringFormat
        $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
        $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
        $textRect = New-Object System.Drawing.RectangleF(0, ($Size * 0.84), $Size, ($Size * 0.12))
        $g.DrawString("LYNX", $font, $textBrush, $textRect, $stringFormat)
        $stringFormat.Dispose()
        $font.Dispose()
        $textBrush.Dispose()
    }

    # Guardar imagen en formato PNG
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generado: $OutPath ($Size x $Size)"
}

# Generar colección completa de iconos requeridos para PWA
Create-LynxIcon -Size 192 -OutPath "public\icons\icon-192.png" -IsMaskable $false
Create-LynxIcon -Size 512 -OutPath "public\icons\icon-512.png" -IsMaskable $false
Create-LynxIcon -Size 192 -OutPath "public\icons\icon-maskable-192.png" -IsMaskable $true
Create-LynxIcon -Size 512 -OutPath "public\icons\icon-maskable-512.png" -IsMaskable $true
Create-LynxIcon -Size 180 -OutPath "public\icons\apple-touch-icon.png" -IsMaskable $false
