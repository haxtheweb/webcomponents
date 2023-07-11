import { fixture, expect, html } from "@open-wc/testing";
import "../course-model.js";
/*
describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<course-model
      title="Colt 1911 Default"
      src="${new URL(
        "../demo/models/guns/colt-1911/colt_1911_full.gltf",
        import.meta.url
      ).href}"
      alt="A 3D model of a Colt 1911 handgun."
    >
      <a href="https://odl.science.psu.edu/" target="_blank" slot="logo">
        <img
          title="ECOS Office of Digital Learning"
          id="brand"
          src="${new URL("../demo/img/ecosodl.png", import.meta.url).href}"
          alt="The Office of Digital Learning"
        />
      </a>
      <model-option
        title="Colt 1911 (.45 Caliber)"
        src="${new URL(
          "../demo/models/guns/colt-1911/colt_1911_full.gltf",
          import.meta.url
        ).href}"
      >
        <span> Default view of the Colt 1911 (.45 Caliber). </span>
      </model-option>
      <model-option
        title="Colt 1911 Cross Section"
        src="${new URL(
          "../demo/models/guns/colt-1911/colt_1911_half.gltf",
          import.meta.url
        ).href}"
      >
        <span> Cross section view of the Colt 1911 (.45 Caliber). </span>
      </model-option>
      <model-option
        title="Colt 1911 Parts"
        src="${new URL(
          "../demo/models/guns/colt-1911/colt_1911_parts.gltf",
          import.meta.url
        ).href}"
      >
        <span> Parts view of the Colt 1911 (.45 Caliber). </span>
      </model-option>
      <model-option
        title="Colt 1911 Clip / Ammunition"
        src="${new URL(
          "../demo/models/guns/colt-1911/colt_1911_clip.gltf",
          import.meta.url
        ).href}"
      >
        <span>
          Cross section view of the Colt 1911 (.45 Caliber) clip / ammunition.
        </span>
      </model-option>
      <div slot="detail">
        <model-info title="Colt 1911 Handgun (.45 Caliber)">
          <p>
            This is a 3D representation of the M1911, also known as the Colt
            1911, or the Colt Government, is a single-action, semi-automatic,
            magazine-fed, recoil-operated pistol chambered for the .45 ACP
            cartridge. It served as the standard-issue sidearm for the United
            States Armed Forces from 1911 to 1985. It was widely used in World
            War I, World War II, the Korean War, and the Vietnam War.
          </p>
          <p>
            Designed by John Browning, the M1911 is the best-known of his
            designs to use the short recoil principle in its basic design. The
            pistol was widely copied, and this operating system rose to become
            the preeminent type of the 20th century and of nearly all modern
            centerfire pistols.
          </p>
          <p>
            Following its success in trials, the Colt pistol was formally
            adopted by the Army on March 29, 1911, when it was designated Model
            of 1911, later changed to Model 1911, in 1917, and then M1911, in
            the mid-1920s. The Director of Civilian Marksmanship began
            manufacture of M1911 pistols for members of the National Rifle
            Association in August 1912. Approximately 100 pistols stamped
            "N.R.A." below the serial number were manufactured at Springfield
            Armory and by Colt. The M1911 was formally adopted by the U.S. Navy
            and Marine Corps in 1913. The .45 ACP "Model of 1911 U.S. Army" was
            used by both US Army Cavalry Troops and Infantry Soldiers during the
            United States' Punitive Expedition into Mexico against Pancho Villa
            in 1916.
          </p>
          <p>
            By the beginning of 1917, a total of 68,533 M1911 pistols had been
            delivered to U.S. armed forces by Colt's Patent Firearms
            Manufacturing Company and the U.S. government's Springfield Armory.
          </p>
          <div id="images" slot="images">
            <media-image
              source="${new URL(
                "../demo/models/guns/img/colt1911-1.jpeg",
                import.meta.url
              ).href}"
              figure-label-title="1.1"
              figure-label-description="This is
            the description of the figure."
              alt="Descriptive image text
            here."
            >
            </media-image>
            <media-image
              source="${new URL(
                "../demo/models/guns/img/colt1911-2.png",
                import.meta.url
              ).href}"
              figure-label-title="2.1"
              figure-label-description="This is
            the description of the figure."
              alt="Descriptive image text
            here."
            >
            </media-image>
            <media-image
              source="${new URL(
                "../demo/models/guns/img/colt1911-3.jpeg",
                import.meta.url
              ).href}"
              figure-label-title="2.2"
              figure-label-description="This is
            the description of the figure."
              alt="Descriptive image text
            here."
            >
            </media-image>
          </div>
        </model-info>
      </div>
      <div slot="animation">
        <video-player source="https://youtu.be/JzXMrzvh1UM"> </video-player>
      </div>
      <div id="check" slot="check">
        <iframe
          src="https://media.ed.science.psu.edu/h5p/embed/5783?entity_iframe=1"
          width="950"
          height="350"
          frameborder="0"
          allowfullscreen=""
        ></iframe>
        <script
          src="https://media.ed.science.psu.edu/sites/all/modules/local_contrib/h5p/library/js/h5p-resizer.js"
          charset="UTF-8"
        ></script>
      </div>
    </course-model>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
*/