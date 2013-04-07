:title: Retina Icons
:date: 2013-04-07
:slug: retina-icons
:description: How to improve the look of you static images on retina devices

On retina display devices the pixel ratio is higher, and therefore images look different from non-retina devices.
They look blurry and pixelated.

To be able to have the same experience you need to have another (higher quality) image for every image you have on the site. This mostly applies to the images that are part of the layout (logo, icons, etc.) not for semantic content ones, which are directly on the HTML source.

So if you have an icons sprite with the size 120x100 pixels, you will need to have one with 240x200 pixels.
To be able to know when to display which image, we would then use media queries.
By convention, the name of the larger image is named the same as the original one with a `@x2` suffix.
So `logo.png` turns into `logo@2x.png`.

The iPhone 5 has a pixel ratio of 2, but some other Android devices have a ratio of 1.5.
It would be nice to improve their experience to them too, I'm using a `min-device-pixel-ratio` of 1.5.

This is how your CSS would look:
<pre class="sh_css">
  @media
    only screen and (-webkit-min-device-pixel-ratio: 1.5),
    only screen and (min-device-pixel-ratio: 1.5) {

    .main-header {
      background-image: url(/assets/images/logo@x2.png);
      -webkit-background-size: 120px 100px; /* The size of the original image */
              background-size: 120px 100px;
    }
  }
</pre>

Hope it helps!
