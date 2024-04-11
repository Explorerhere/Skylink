import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Link,
  useDisclosure,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

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
        bg: 'red.500', // Red hover effect
      }}
      color={'gold'} // Gold text
      fontWeight="bold"
    >
      {children}
    </Link>
  );

  return (
    <Box>
      <Flex
        bg={'rgba(0, 0, 0, 0.5)'} // Semi-transparent black background
        color={'gold'} // Gold text color
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
        justifyContent={{ base: 'flex-start', md: 'space-between' }} // Adjust positioning for brand and nav items
      >
        <Flex display={{ base: 'flex', md: 'none' }} ml={{ base: -2 }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            color={'gold'} // Gold icon
          />
        </Flex>
        
        <Flex flex={{ base: 1, md: 'auto' }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            fontWeight={'extrabold'}
            fontSize={'xl'}
            color={'gold'} // Gold text
          >
            SKYLINKER AEROPATHWAYS
          </Text>
        </Flex>
        
        <Spacer display={{ base: 'none', md: 'flex' }} />
        
        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/flightsearch">Flight Search</NavLink>
          <NavLink to="/airporttimetable">Airport Timetable</NavLink>
          <NavLink to="/SearchByRoute">Search By Routes</NavLink>
          <NavLink to="/HistoricalFlight">Flight schedules</NavLink>
        </Flex>
        
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          bg={'rgba(0, 0, 0, 0.5)'} // Semi-transparent black background for mobile menu
          p={4}
          display={{ md: 'none' }}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/flightsearch">Flight Search</NavLink>
          <NavLink to="/airporttimetable">Airport Timetable</NavLink>
          <NavLink to="/SearchByRoute">Search By Routes</NavLink>
          <NavLink to="/HistoricalFlight">Flight schedules</NavLink>
        </Stack>
      </Collapse>
    </Box>
  );
}
