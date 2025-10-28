export default () => {

  return (
    <div className="about">
      <h3>About</h3>
        <p>
          Greetings and salutions! With Visions of Eternity comes the ability to save your homestead layout as an XML file and share it with other players.
          With this also comes the possibility to leverage the Power of MATH!
          <br />
          By which I mean it is possible to manually edit said XML file to achieve things that are impossible or at least very tedious to do in game.
          <br />
          For example you might want to arrange all your Joko Statues on a 3×3 grid spread exactly 20 "meters" apart. ("meters" in quotes because I don't know how big a unit of distance is in-game and yes I am from Europe).
          I think you can see this would be a hassle to try to do manually.
          <br />
          Another tedious thing is I think dealing with "compound" decorations, i.e. several decoration put together to create a whole, like a table with all kinds of stuff on it.
          Your friend might share this with you, or find it on some decoration site that wil undoubtedly pop up.
          <br />
          But if you copy their stuff it will be placed in exactly same the place as they have it. And if you want to move it to the other side of the room you can only move it one decoration at a time.
          MATH can rotate and reposition everything by the exact same amout.
          <br />
          And this is where Homesteadorator comes in. I created a bunch of tools to make decorating easier, and you don't even need to learn the math behind it.
          Simply copypaste your decorations, modify them and put the result in a new layout file (because you want have a backup).
        </p>
        <p>
          Now for some mild technobbabble.<br />
          In the homestead livestream (!!Youtube Link!!) we learned the structure of a decoration element (and I hope they haven't changed it since then):
          <code className="block">
              &lt;prop id="1234" name="Some Kinda Decoration" pos="2528.722089 -1326.142439 -5424.276504" rot="0.000000 0.429515 0.625864" scl="0.966357" /&gt;
          </code>
          As you can see we have the position <code>pos</code> with x,y,z coordinates, rotation <code>rot</code> with x,y,z angles and scale <code>scl</code>. (The values are made up)<br />
          I'm fairly certain position refers to the middle of the decoration's base (i.e. the center of the rotation controls in-game), at least for decorations with flat bases.
          There might theoretically be other attributes for stuff like a weapon stand that states which weapon is displayed, we shall see.
          <br />
          What I know for certain is that on ANet's side a circle is split into 1024 segments, or multiples thereof (saved as radians - those are the ones with fractions of π -
          i.e. <code>0.429515</code> equates to an angle of 70 units, rounded down to 6 decimal places).
          <br />
          As you can see both position and scale also have 6 decimal places but I don't yet know what the smallest unit is. I also don't know the bounds of a homestead map (e.g. how far west can you put a decoration)
          but I do know the bounds for players and decorations are different - you can put a decoration beyond the invisible walls. And I know don't what the smallest and largest scale is.
          <br/>
          The tools are now working with dummy values (so I don't recommend putting the results in your layout files yet), but I only have to replace those in place and everything else should work fine.
          <br/>
        </p>
        <p>
          The one big hurdle is that you cannot tell the dimensions of a given decoration (height, width, length), these are not impossible to figure out but it's not feasible for me to create a database of every single decorations in existence.
          For tools that would need to know the exact dimensions (for stacking things next to each other with no gap or overlap) a little work on your part will be required.
        </p>
        <p>
          I think that's it, have fun.
        </p>
    </div>
  )
}