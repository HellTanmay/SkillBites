
const Footer = (props) => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  return (
    <>
      {/* adding the footer */}
      <div className=" footer py-5 text-white align-items-center justify-content-center" style={props.style}>
        {/* adding copyright section */}
        <section className="text-lg">
          Copyright©{year} | All Rights Reserved
        </section>

      
      
      </div>
    </>
  );
};

export default Footer;
