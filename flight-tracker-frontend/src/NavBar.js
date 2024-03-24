import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  useDisclosure,
  Spacer,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import AccountMenu from './AccountMenu'; // Update the path if necessary

export default function NavBar() {
  const { isOpen, onToggle } = useDisclosure();

  const NavLink = ({ children, to }) => (
    <Link
      as={RouterLink}
      to={to}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      color={useColorModeValue('gray.800', 'white')} // Set text color based on color mode
      fontWeight="bold" // Set font weight to bold
    >
      {children}
    </Link>
  );

  return (
    <Box>
      <Flex
        bg={'skyblue'} // Set background to sky blue
        color={'gray.800'} // Set text color to dark gray
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
      >
        {/* Mobile menu button */}
        <Flex display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        
        {/* Logo or brand text */}
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            fontWeight={'bold'} // Set font weight to bold
            fontSize={'xl'} // Set font size
          >
            SkyLinker AeroPathways
          </Text>
        </Flex>
        
        {/* Spacer to push the navigation to the right */}
        <Spacer />
        
        {/* Desktop menu items */}
        <Flex display={{ base: 'none', md: 'flex' }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/flightsearch">Flight Search</NavLink>
          <NavLink to="/airporttimetable">Airport Timetable</NavLink>
          <NavLink to="/SearchByRoute">Search By Routes</NavLink> {/* Corrected spacing */}
          <NavLink to="/HistoricalFlight">Flight schedules</NavLink> {/* Corrected spacing */}

        </Flex>
        
        {/* Account menu always on the right */}
        <AccountMenu />
      </Flex>

      {/* Mobile menu items */}
      <Collapse in={isOpen} animateOpacity>
        <Stack
          bg={'skyblue'} // Ensure the mobile menu is also sky blue
          p={4}
          display={{ md: 'none' }}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/flightsearch">Flight Search</NavLink>
          <NavLink to="/airporttimetable">Airport Timetable</NavLink>
        </Stack>
      </Collapse>
    </Box>
  );
}
