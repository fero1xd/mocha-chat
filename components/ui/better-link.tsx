import {
  Link as _Link,
  LinkProps,
  useLocation,
  useNavigate,
} from "react-router";

type Props = LinkProps & React.RefAttributes<HTMLAnchorElement>;

export function Link(props: Props) {
  const navigate = useNavigate();
  const path = useLocation();

  return (
    <_Link
      {...props}
      onClick={(e) => {
        e.preventDefault();
        if (path.pathname !== props.to) {
          navigate(props.to);
        }
      }}
    >
      {props.children}
    </_Link>
  );
}
